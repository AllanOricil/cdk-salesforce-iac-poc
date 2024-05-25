import * as path from "path";
import * as dotenv from "dotenv";

export function getEnvVar(name: string) {
  return process.env[name] ?? "";
}

export function isEnvVariableEmpty(envVariableName: string): void {
  if (process.env[envVariableName] === undefined) {
    throw Error(`${envVariableName} env variable can't be empty`);
  }
}

export function loadEnvVariables() {
  const NODE_ENV = getEnvVar("NODE_ENV");
  const dotEnvFile = ["dev", "staging", "production"].includes(NODE_ENV)
    ? `.env.${NODE_ENV}`
    : ".env";
  const dotEnvFilePath = path.resolve(__dirname, `../${dotEnvFile}`);
  console.log(`DOT ENV FILE PATH: ${dotEnvFilePath}`);
  dotenv.config({
    path: dotEnvFilePath,
  });
  console.log(process.env);
}
