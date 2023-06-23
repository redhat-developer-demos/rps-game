import log from '../log';
import fp from 'fastify-plugin';
import { BotMachine } from '../players';
import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

export type BotPluginOps = {
  botMachine: BotMachine
}

const botPlugin: FastifyPluginCallbackTypebox<BotPluginOps> = (server, options, done) => {
  server.post('/bot', {}, async (req, reply) => {
    const botId = await options.botMachine.createBotPlayer();

    log.info(`created a new bot with ID ${botId}`)

    reply.send({ botId });
  });

  done();
};

export default fp(botPlugin);