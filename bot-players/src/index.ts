import startServer from './server';
import log from './log';
import closeWithGrace = require('close-with-grace')
import { CLOSE_WITH_GRACE_DELAY, GAME_SERVER_URL } from './config';
import getBotsMachine from './players';
import getServerSentEventSource from './sse';
import getApiWrapper from './api';

async function main() {
  log.info('bootstrapping bot players server');

  const sse = getServerSentEventSource(GAME_SERVER_URL)
  const api = getApiWrapper(GAME_SERVER_URL)
  const botMachine = getBotsMachine(sse, api)

  const app = await startServer(botMachine);

  log.info('registering process signal handlers')
  closeWithGrace({ delay: CLOSE_WITH_GRACE_DELAY }, async function ({ signal, err, manual }) {
    if (err) {
      log.error('process will terminate due to an error: %j', err)
    } else {
      log.info(`process will terminate due to signal ${signal}. waiting for server to close, or for ${CLOSE_WITH_GRACE_DELAY}ms before exiting`)
    }

    await app.close()
  })
}

main();