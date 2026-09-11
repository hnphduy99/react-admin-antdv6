// redux-persist's "redux-persist/lib/storage" default export doesn't resolve
// correctly through Vite's CJS interop, so use a plain localStorage adapter.
// Falls back to a no-op storage when localStorage is unavailable (SSR,
// private browsing, disabled storage) so persistence fails silently
// instead of crashing the app.
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve()
};

export const createLocalStorage = () => {
  if (typeof window === "undefined") return noopStorage;

  try {
    const testKey = "__redux_persist_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
  } catch {
    return noopStorage;
  }

  return {
    getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    },
    removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key))
  };
};
