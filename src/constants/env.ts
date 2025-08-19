function getEnv(
  key: string | number,
  defaultValue?: string | number
): string | number {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
}

export const PORT = getEnv('PORT', 4000);
export const DATABASE_URL = getEnv('DATABASE_URL') as string;
export const TEST_DATABASE_URL = getEnv('TEST_DATABASE_URL') as string;
export const NODE_ENV = getEnv('NODE_ENV') as string;
export const JWT_SECRET = getEnv('JWT_SECRET') as string;
