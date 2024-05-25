import { CdkCustomResourceEvent } from "aws-lambda";
import logger from "@services/logger";
import { setupHandler } from "@handlers/lambda";
import { SALESFORCE_CLIENT_SECRET } from "@resources/lambda/constants";

export const main = setupHandler(
  async function (event: CdkCustomResourceEvent): Promise<any> {
    try {
      // TODO: generate manifests
      // TODO: zip manifest
      // TODO: auth using jsforce, alongisde connected app and integration user env variables
      // TODO: initialize a salesforce deployment
    } catch (err) {
      logger.error(
        "something unknown happened while starting salesforce metadata deployment",
        err
      );
      throw err;
    }
  },
  [SALESFORCE_CLIENT_SECRET]
);
