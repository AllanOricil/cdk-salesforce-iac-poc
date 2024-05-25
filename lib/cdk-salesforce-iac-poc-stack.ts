import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { getEnvVar } from "./utils";
import { SalesforceObject } from "./constructs/salesforce-object";
import { SalesforceMetadata } from "./constructs/salesforce-metadata";
import { SalesforceObjectField } from "./constructs/salesforce-object-field";

export class CdkSalesforceIacPocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const salesforceObject = new SalesforceObject(
      this,
      "salesforce-custom-object",
      {
        name: "MyCustomObject",
        fields: [
          new SalesforceObjectField(this, "salesforce-custom-object-field", {
            name: "test",
            type: "Text",
          }),
        ],
      }
    );

    new SalesforceMetadata(this, "salesforce-metadata", {
      objects: [salesforceObject],
    });
  }
}
