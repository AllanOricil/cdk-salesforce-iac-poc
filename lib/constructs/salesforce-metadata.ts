import * as path from "path";
import * as cdk from "aws-cdk-lib/core";
import * as cr from "aws-cdk-lib/custom-resources";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { SalesforceObject } from "./salesforce-object";
import { getEnvVar } from "../utils";
import {
  DEFAULT_LAMBDA_DOCKER_BUILD_IMAGE,
  DEFAULT_LAMBDA_HANDLERS_DIRECTORY_PATH,
  DEFAULT_LAMBDA_RUNTIME,
} from "../constants";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export interface SalesforceMetadataProps {
  objects: SalesforceObject[];
}

export class SalesforceMetadata extends Construct {
  private readonly objects: SalesforceObject[];

  constructor(scope: Construct, id: string, props: SalesforceMetadataProps) {
    super(scope, id);

    this.objects = props.objects;
    const salesforceClientSecret = this.createSecret(
      "salesforceClientSecret",
      "salesforce/client-secret",
      getEnvVar("SALESFORCE_CLIENT_SECRET_SECRET"),
      "stores salesforce connected app client secret which is used by lambda functions at runtime"
    );

    const salesforceProviderDeployMetadataHandler = this.createLambdaFunction(
      "salesforce-provider-deploy-metadata-handler",
      salesforceClientSecret
    );

    const salesforceProviderDeployMetadataStatusCheckHandler =
      this.createLambdaFunction(
        "salesforce-provider-deploy-metadata-status-check-handler",
        salesforceClientSecret
      );

    const salesforceProvider = new cr.Provider(this, "SalesforceProvider", {
      onEventHandler: salesforceProviderDeployMetadataHandler, // NOTE: this will start the deployment flow and return immediately after submiting the metadata manifests to Salesforce
      isCompleteHandler: salesforceProviderDeployMetadataStatusCheckHandler, // NOTE: this will keep pulling the deployment status from Salesforce
      logRetention: RetentionDays.ONE_DAY,
    });

    new cdk.CustomResource(this, "SalesforceMetadataResource", {
      serviceToken: salesforceProvider.serviceToken,
      resourceType: "Custom::SalesforceMetadata",
      properties: {
        objects: this.objects,
      },
    });
  }

  private createSecret(
    parameterId: string,
    secretName: string,
    defaultValue: string,
    description: string
  ): secretsmanager.Secret {
    const parameter = new cdk.CfnParameter(this, parameterId, {
      type: "String",
      noEcho: true,
      default: defaultValue,
      description,
    });

    return new secretsmanager.Secret(this, `${secretName}-secret`, {
      secretName,
      secretStringValue: cdk.SecretValue.cfnParameter(parameter),
      description,
    });
  }

  private createLambdaFunction(
    name: string,
    salesforceClientSecret: secretsmanager.Secret
  ): NodejsFunction {
    return new NodejsFunction(this, name, {
      functionName: name,
      entry: path.resolve(
        DEFAULT_LAMBDA_HANDLERS_DIRECTORY_PATH,
        name,
        "index.ts"
      ),
      handler: "main",
      runtime: DEFAULT_LAMBDA_RUNTIME,
      timeout: cdk.Duration.minutes(15),
      memorySize: cdk.Size.mebibytes(128).toMebibytes(),
      retryAttempts: 0,
      environment: {
        SALESFORCE_CLIENT_ID: getEnvVar("SALESFORCE_CLIENT_ID"),
        SALESFORCE_CLIENT_SECRET_SECRET_ID: salesforceClientSecret.secretName, // NOTE: secret name is injected so that it can be fetched at runtime
        SALESFORCE_USERNAME: getEnvVar("SALESFORCE_USERNAME"),
        SALESFORCE_USER_PASSWORD: getEnvVar("SALESFORCE_PASSWORD"),
      },
      bundling: {
        sourceMap: true,
        nodeModules: ["winston", "jsonwebtoken", "jsforce"],
        externalModules: ["aws-sdk", "@aws-sdk"],
        user: "root",
        forceDockerBundling: true,
        dockerImage: DEFAULT_LAMBDA_DOCKER_BUILD_IMAGE,
      },
    });
  }
}
