const cache = require('memory-cache');

class MemoryCacheService {
  static get(key) {
    return cache.get(key);
  }

  static put(key, value, duration) {
    return cache.put(key, value, duration);
  }

  static del(key) {
    return cache.del(key);
  }
}

module.exports = MemoryCacheService