import Redis from 'ioredis';
import logger from 'lib/logger';

export const createClient = (type, opt) => {
  try {
    logger.debug(`Creating Redis ${type}`);
    return new Redis(process.env.REDIS_URL, opt);
  } catch (e) {
    logger.error("Couldn't connect to redis", e);
    logger.debug(e);
  }
};
