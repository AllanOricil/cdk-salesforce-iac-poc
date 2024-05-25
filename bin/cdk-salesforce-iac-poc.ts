#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkSalesforceIacPocStack } from "../lib/cdk-salesforce-iac-poc-stack";
import { isEnvVariableEmpty, loadEnvVariables } from "../lib/utils";

loadEnvVariables();

isEnvVariableEmpty("SALESFORCE_CLIENT_ID");
isEnvVariableEmpty("SALESFORCE_CLIENT_SECRET");
isEnvVariableEmpty("SALESFORCE_USERNAME");
isEnvVariableEmpty("SALESFORCE_PASSWORD");

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new CdkSalesforceIacPocStack(app, "cdk-salesforce-iac-poc-stack", {
  stackName: "cdk-salesforce-iac-poc-stack",
  env,
});
