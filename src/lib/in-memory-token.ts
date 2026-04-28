// lib/token-cache.ts
const refreshLocks = new Map<string, Promise<string>>()

export const RefreshLockManager = {
  getLock: (username: string) => refreshLocks.get(username) ?? null,
  setLock: (username: string, promise: Promise<string>) => {
    refreshLocks.set(username, promise)
    promise.finally(() => refreshLocks.delete(username))
  },
}

export const TokeCacheManager = new Map<string, string>()
