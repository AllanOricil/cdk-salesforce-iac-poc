import { CdkCustomResourceIsCompleteEvent } from "aws-lambda";
import logger from "@services/logger";
import { setupHandler } from "@handlers/lambda";
import { SALESFORCE_CLIENT_SECRET } from "@resources/lambda/constants";

export const main = setupHandler(
  async function (event: CdkCustomResourceIsCompleteEvent): Promise<any> {
    try {
      // TODO: auth using jsforce, alongisde connected app and integration user env variables
      // TODO: pool salesforce deployment job status
      // TODO: if it is over, return { 'IsComplete': true or false } => ref: https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.custom_resources/README.html
    } catch (err) {
      logger.error(
        "something unknown happened while check metadata deploy status",
        err
      );
      throw err;
    }
  },
  [SALESFORCE_CLIENT_SECRET]
);
