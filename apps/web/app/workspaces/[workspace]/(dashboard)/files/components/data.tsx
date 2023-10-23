import { EnvironmentVariables } from "database";

export type SecretFiles = Omit<EnvironmentVariables, "updated_at" | "secretId">;
