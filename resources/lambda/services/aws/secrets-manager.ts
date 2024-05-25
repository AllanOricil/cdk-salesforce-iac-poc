import {
  SecretsManagerClient,
  SecretsManagerClientConfig,
  GetSecretValueCommand,
  type GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";
import { AWS_CLIENTS_MAX_ATTEMPTS } from "./common";

export class SecretsManager {
  private static instance: SecretsManager | undefined;
  private client: SecretsManagerClient;

  private constructor(config?: SecretsManagerClientConfig) {
    this.setClient(config);
  }

  static getInstance(config?: SecretsManagerClientConfig): SecretsManager {
    if (!SecretsManager.instance) {
      SecretsManager.instance = new SecretsManager(config);
    } else {
      SecretsManager.instance.setClient(config);
    }
    return SecretsManager.instance;
  }

  setClient(config?: SecretsManagerClientConfig) {
    this.client = new SecretsManagerClient({
      maxAttempts: config?.maxAttempts ?? AWS_CLIENTS_MAX_ATTEMPTS,
      ...(config ?? {}),
    });
  }

  async retrieveSecret(secretId: string): Promise<GetSecretValueCommandOutput> {
    const getSecretValueCommand = new GetSecretValueCommand({
      SecretId: secretId,
    });
    return await this.client.send(getSecretValueCommand);
  }

  async retrieveSecrets(
    secretIds: string[]
  ): Promise<GetSecretValueCommandOutput[]> {
    const responses = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      secretIds.map((secretId) => {
        return this.retrieveSecret(secretId);
      })
    );

    return responses;
  }
}
