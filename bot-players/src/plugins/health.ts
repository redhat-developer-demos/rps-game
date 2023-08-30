import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { uptime } from 'process';
import humanize = require('humanize-duration');
import { BotMachine } from '../players';

export type HealthPluginOptions = {
  version: string,
  botMachine: BotMachine
}

const healthPlugin: FastifyPluginCallback<HealthPluginOptions> = (
  server,
  { version, botMachine },
  done
) => {
  server.route({
    method: 'GET',
    url: '/health',
    handler: async () => {
      return {
        status: 'ok',
        botCount: botMachine.getBotCount(),
        uptime: humanize(uptime() * 1000),
        serverTime: new Date().toJSON(),
        version: version,
        memory: process.memoryUsage()
      };
    }
  });

  done();
};

export default fp(healthPlugin);