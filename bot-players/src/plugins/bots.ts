import log from '../log';
import fp from 'fastify-plugin';
import { BotMachine } from '../players';
import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import PQueue from 'p-queue';

export type BotPluginOps = {
  botMachine: BotMachine
}

const botPlugin: FastifyPluginCallbackTypebox<BotPluginOps> = (server, options, done) => {
  const queue = new PQueue({
    // Only wait 1000ms for a queue item to process before throwing an error
    timeout: 1000,

    // In 1000ms, only 100 bots can be created. This prevents spamming the
    // game server too hard since
    interval: 1000,
    intervalCap: 100
  });

  server.post('/bot', {
    schema: {
      body: Type.Object({
        count: Type.Number({
          default: 1,
          minimum: 1,
          maximum: 100
        })
      })
    }
  }, async (req, reply) => {
    if (queue.size > 0 || queue.pending > 0) {
      log.warn('received a request to create bots, but bot queue has existing items')
      reply.status(503).send('Bot creation in progress. Try again later')
    } else {
      const { count } = req.body
      const botIds: string[] = []

      for (let i = 0; i < count; i++) {
        queue.add(async () => {
          try {
            const id = await options.botMachine.createBotPlayer();

            botIds.push(id)

            log.info(`created a new bot with ID ${id}`)
          } catch (e) {
            log.error('failed to create a bot player')
            log.error(e)
          }
        })
      }
  
      await queue.onIdle()
  
      reply.send({ botIds });
    }
  });

  done();
};

export default fp(botPlugin);