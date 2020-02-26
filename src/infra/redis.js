const Redis = require('ioredis');

const DEFAULT_URL = 'redis://127.0.0.1:6379'
const REDIS_URL = process.env.REDIS_RUL || DEFAULT_URL;
const redis = new Redis(REDIS_URL);

redis
  .on('error', (error) => {
    console.error(error);
  })
  .on('connect', () => {
    console.log(`Server is connected to redis at ${REDIS_URL}`);
  });

module.exports = redis;
