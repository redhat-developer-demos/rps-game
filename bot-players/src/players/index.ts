import { ApiWrapper, ImageType } from "../api";
import log from "../log";
import { SSEObservable, SSEType } from "../sse";
import createPlayerMachine from "./fsm";

const botPlayers = new Map<string, ReturnType<typeof createPlayerMachine>>();

export default function getBotsMachine (sse: SSEObservable, api: ApiWrapper, imageType?: ImageType): BotMachine {

  // Anytime an SSE arrives, notify all the bots. This will make them change
  // state, e.g from "waiting" to "selectShape" so they submit a shape
  sse.subscribe((value) => {
    const types = Object.values(SSEType)
    if (types.includes(value.type as SSEType)) {

      if (value.type === SSEType.Heartbeat) {
        log.trace('skip sending heartbeat to bot')
      }

      botPlayers.forEach(bot => {
        // TODO: should probably improve types here, but tis fine...
        bot.send({
          type: (value.type as SSEType).toUpperCase(),
          data: value.content
        } as any)
      })
    } else {
      log.warn('received unknown SSE message type:', value)
    }
  })
  
  return {
    createBotPlayer () {
      const bot = createPlayerMachine(api, imageType)
    
      botPlayers.set(bot.id, bot)

      bot.onTransition((state) => {
        if (state.changed) {
          log.debug(`${bot.id} changed to state ${state.value}`)
        }
      })

      // Clean bots up once the game has ended
      bot.onDone(() => {
        log.info(`cleaning up bot ${bot.id}`)
        bot.stop()
        botPlayers.delete(bot.id)
      })

      bot.start()
    
      return bot.id
    },

    getBotCount() {
      return botPlayers.size
    }
  }
}

export type BotMachine = {
  createBotPlayer(): string
  getBotCount(): number
}