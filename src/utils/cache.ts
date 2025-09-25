type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const cache: Record<string, CacheEntry<any>> = {};

export const getCache = <T>(key: string): T | null => {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    delete cache[key];
    return null;
  }
  return entry.data;
};

export const setCache = <T>(key: string, data: T, ttlMs: number) => {
  cache[key] = {
    data,
    expiresAt: Date.now() + ttlMs,
  };
};
