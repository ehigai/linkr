import { ONE_DAY_MS } from './date';

export const shouldExtendSession = (expiresAt: Date): boolean => {
  return expiresAt.getTime() - Date.now() <= ONE_DAY_MS; // one day in ms
};
