import pino from 'pino';
import { LOG_LEVEL, NODE_ENV } from './config';

const level = LOG_LEVEL ? LOG_LEVEL : NODE_ENV === 'prod' ? 'info' : 'debug';

const log = pino({
  level
});

export default log;