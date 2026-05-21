// token 驗證
const { LRUCache } = require('lru-cache');

// 1. 初始化 LRU 快取
const tokenCache = new LRUCache({
    max: 5000,
    ttl: 1000 * 60 * 15,
    updateAgeOnGet: false,
});

module.exports = {
    tokenCache,
};