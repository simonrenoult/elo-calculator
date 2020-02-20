import Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redis = new Redis(REDIS_URL);

redis
  .on('connect', () => {
    console.log(`[redis] Server connected to redis instance on port ${REDIS_URL}`);
  })
  .on('error', (error) => {
    console.error('[redis] An error occurred:', error);
  });

export default redis;
