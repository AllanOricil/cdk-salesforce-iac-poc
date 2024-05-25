import { type Context, type Callback, type Handler } from "aws-lambda";
import logger from "@services/logger";
import { loadSecrets, type Secret } from "@services/secrets";

export const setupHandler = (
  handler: Handler,
  secretsToLoad?: Secret[]
): Handler => {
  return async (event: any, context: Context, callback: Callback) => {
    try {
      logger.defaultMeta = { requestId: context.awsRequestId };
      logger.info("event", event);
      await loadSecrets(secretsToLoad ?? []);
      const result = await handler(event, context, callback);
      logger.info("finished executing handler", result);
      return result;
    } catch (err) {
      logger.error("unknown error happened while executing handler", err);
      throw err;
    }
  };
};
