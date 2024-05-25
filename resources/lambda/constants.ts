import { getEnvVar } from "@lambda/utils";
import { type Secret } from "@services/secrets";

const SALESFORCE_CLIENT_SECRET: Secret = {
  key: "SALESFORCE_CLIENT_SECRET",
  value: getEnvVar("SALESFORCE_CLIENT_SECRET"), // NOTE: initial value can be set using env var
  secretsManagerId: getEnvVar("SALESFORCE_CLIENT_SECRET_SECRET_ID"),
};

export { SALESFORCE_CLIENT_SECRET };
