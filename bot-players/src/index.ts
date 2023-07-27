import startServer from './server';
import log from './log';
import closeWithGrace = require('close-with-grace')
import config from './config';
import getBotsMachine from './players';
import getServerSentEventSource from './sse';
import getApiWrapper from './api';

async function main() {
  log.info('bootstrapping bot players server');

  const {
    GAME_SERVER_URL,
    GAME_UPLOAD_IMAGES,
    CLOSE_WITH_GRACE_DELAY,
    NODE_TLS_REJECT_UNAUTHORIZED
  } = config

  const sse = getServerSentEventSource(GAME_SERVER_URL, NODE_TLS_REJECT_UNAUTHORIZED)
  const api = getApiWrapper(GAME_SERVER_URL)
  const botMachine = getBotsMachine(sse, api, GAME_UPLOAD_IMAGES)

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