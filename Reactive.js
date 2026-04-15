const proxyCache = new WeakMap();

export function reactive(obj, onChange, basePath = "") {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // 🔥 return cached proxy
  if (proxyCache.has(obj)) {
    return proxyCache.get(obj);
  }

  const proxy = new Proxy(obj, {
    get(target, key) {
      const value = target[key];

      if (typeof value === "object" && value !== null) {
        const newPath = basePath ? `${basePath}.${key}` : key;
        return reactive(value, onChange, newPath);
      }

      return value;
    },

    set(target, key, value) {
      target[key] = value;

      const path = basePath ? `${basePath}.${key}` : key;

      onChange(path);

      return true;
    },
  });

  proxyCache.set(obj, proxy);

  return proxy;
}
