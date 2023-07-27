'use strict';

import { get } from 'env-var';
import { Level, levels } from 'pino';

export type ApplicationConfig = {
  NODE_ENV: 'dev'|'prod'
  LOG_LEVEL: Level
  HTTP_PORT: number
  GAME_SERVER_URL: string
  GAME_UPLOAD_IMAGES: boolean
  CLOSE_WITH_GRACE_DELAY: number
}

const config: ApplicationConfig = {
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod']),
  LOG_LEVEL: get('LOG_LEVEL').default('info').asEnum<Level>(Object.keys(levels.values) as  Level[]),
  HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
  GAME_SERVER_URL: get('GAME_SERVER_URL').required().asUrlString(),
  GAME_UPLOAD_IMAGES: get('GAME_UPLOAD_IMAGES').default('true').asBool(),
  CLOSE_WITH_GRACE_DELAY: get('CLOSE_WITH_GRACE_DELAY').default(5000).asIntPositive(),
};

export default config;