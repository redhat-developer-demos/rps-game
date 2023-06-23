import fastify from 'fastify';
import { HTTP_PORT, NODE_ENV } from './config';
import log from './log';
import { BotMachine } from './players';
import { BotPluginOps } from './plugins/bots';
import { HealthPluginOptions } from './plugins/health';

const { version } = require('../package.json');

export default async function startServer(botMachine: BotMachine) {
  const app = fastify({ logger: NODE_ENV !== 'prod' });

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
    await app.listen(HTTP_PORT, '0.0.0.0');
    log.info(`server started listening on 0.0.0.0:${HTTP_PORT}`);
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}