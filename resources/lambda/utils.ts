export function getEnvVar(name: string) {
  return process.env[name] ?? "";
}

export function getEnvVarBoolean(envVariableName: string): boolean | undefined {
  const envValue = process.env[envVariableName];

  if (envValue === undefined) {
    return undefined;
  }

  return envValue.toLowerCase() === "true";
}
