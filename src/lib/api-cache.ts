/**
 * Simple in-memory cache for rarely-changing reference data (categories, locations).
 * Avoids redundant serverless invocations when multiple components on the same page
 * independently fetch the same data.
 *
 * Cache entries expire after `ttl` ms (default: 5 minutes).
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch with in-memory caching. Concurrent calls for the same key
 * share a single in-flight request (request deduplication).
 */
export async function cachedFetch<T>(
  url: string,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const entry = cache.get(url) as CacheEntry<T> | undefined;

  // Return cached data if still fresh
  if (entry?.data && Date.now() - entry.timestamp < ttl) {
    return entry.data;
  }

  // Deduplicate concurrent in-flight requests
  if (entry?.promise) {
    return entry.promise;
  }

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return res.json() as Promise<T>;
    })
    .then((data) => {
      cache.set(url, { data, timestamp: Date.now() });
      return data;
    })
    .catch((err) => {
      // Remove failed entry so next call retries
      cache.delete(url);
      throw err;
    });

  cache.set(url, { ...(entry || { data: undefined as T, timestamp: 0 }), promise });
  return promise;
}

/**
 * Invalidate a specific cache entry (e.g. after a mutation).
 */
export function invalidateCache(url: string): void {
  cache.delete(url);
}

/**
 * Invalidate all cache entries.
 */
export function clearCache(): void {
  cache.clear();
}
