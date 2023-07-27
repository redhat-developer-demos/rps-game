import fastify from 'fastify';
import config from './config';
import log from './log';
import { BotMachine } from './players';
import { BotPluginOps } from './plugins/bots';
import { HealthPluginOptions } from './plugins/health';

const { version } = require('../package.json');

export default async function startServer(botMachine: BotMachine) {
  const app = fastify({ logger: config.NODE_ENV !== 'prod' });

  // Provides a health endpoint to check
  app.register(require('./plugins/health'), {
    version,
    botMachine
  }  as HealthPluginOptions);

  // Allows CRUD on bot players
  app.register(require('./plugins/bots'), {
    botMachine
  } as BotPluginOps);


  try {
    await app.listen(config.HTTP_PORT, '0.0.0.0');
    log.info(`server started listening on 0.0.0.0:${config.HTTP_PORT}`);
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}