import logger from "@services/logger";
import { SecretsManager } from "@services/aws/secrets-manager";

export interface Secret {
  key: string;
  value: string;
  secretsManagerId: string;
}

// NOTE: this is called only when running in lambda
const secrets: Record<string, string> = {};
export async function loadSecrets(
  secretsToLoad: Secret[]
): Promise<Record<string, string>> {
  if (Object.keys(secrets)?.length) {
    logger.info("using cached secrets");
    return secrets;
  }

  try {
    logger.info("fetching secrets from secrets manager");
    const secretsManager = SecretsManager.getInstance();
    const responses = await secretsManager.retrieveSecrets(
      secretsToLoad.map((secret) => {
        return secret.secretsManagerId;
      })
    );
    responses.forEach((response, index) => {
      const secretId = secretsToLoad[index].secretsManagerId;
      const secretKey = secretsToLoad[index].key;
      if (!response.SecretString) {
        throw new Error(`${secretId} can't be empty`);
      }
      const secretValue = response.SecretString;
      secrets[secretKey] = secretValue;
    });
    logger.secure(JSON.stringify(secrets));
    return secrets;
  } catch (error) {
    logger.error("error while retrieving secrets from secrets manager", error);
    throw error;
  }
}

export function getSecrets(): Record<string, string> {
  return secrets;
}
