import pino from 'pino';
import config from './config';

const level = config.LOG_LEVEL ? config.LOG_LEVEL : config.NODE_ENV === 'prod' ? 'info' : 'debug';

const log = pino({
  level
});

export default log;