'use strict';

import { get } from 'env-var';

const config = {
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod']),
  LOG_LEVEL: get('LOG_LEVEL').default('info').asString(),
  HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
  GAME_SERVER_URL: get('GAME_SERVER_URL').required().asUrlString(),
  CLOSE_WITH_GRACE_DELAY: get('CLOSE_WITH_GRACE_DELAY').default(10000).asIntPositive()
};

export = config;