
import { Observable, multicast } from "observable-fns"
import { ScoreData, Shape } from "./api"
import EventSource = require("eventsource")
import log from './log'

/**
 * This function creates an Observable that emits payloads received from an
 * SSE connection to the server. It will transparently handle connection 
 * errors and reconnect attempts.
 * @returns Observable<SSE<unknown>>
 */
export default function getServerSentEventSource (baseUrl: string): SSEObservable {
  const url = new URL('/game/stream', baseUrl).toString()

  return multicast(new Observable<SSE<unknown>>(observer => {
    function createEventSource () {
      log.info(`creating event source to url: ${url}`)

      const es = new EventSource(url)

      es.addEventListener('open', (event) => {
        log.info('SSE "open" event %j', event)
      })
      
      es.addEventListener('error', (event) => {
        log.error('SSE "error" event received. Will close and attempt to reconnect. Error event: %j', event)
        
        setTimeout(() => {
          log.info('attempting to create new event source in 1 second')
          createEventSource()
        }, 1000)
      })
  
      // es.addEventListener('close', (event) => {
      //   log.warn('SSE "close" event %j', event)

      //   setTimeout(() => {
      //     log.info('attempting to create new event source in 1 second')
      //     createEventSource()
      //   }, 1000)
      // })

      es.addEventListener('message', (event) => {
        log.debug('SSE "message" event: %j', event)
        log.debug('SSE "message" event.data: %j', event.data)
        try {
          observer.next(JSON.parse(event.data))
        } catch (e) {
          log.error('error parsing received event: %j', event)
        }
      })
    }

    createEventSource()
  }))
}

export type SSEObservable = Observable<SSE<unknown>>

export enum SSEType {
  Start = 'start',
  Stop = 'stop',
  End = 'end',
  Heartbeat = 'heartbeat'
} 

export type SSEContentEnable = {
  currentRound: number,
  lengthOfRoundInSeconds: number
}
export type SSEContentDisable = ScoreData&{
  team1:  { count: number, shape: Shape },
  team2:  { count: number, shape: Shape },
  winner: 'TIE'|string
}
export type SSEContentEnd = ScoreData

export type SSEContent = SSEContentDisable|SSEContentEnable|SSEContentEnd

export type SSE<E extends SSEType|unknown> = {
  type: E,
  content: E extends SSEType.Start ? SSEContentEnable : 
            E extends SSEType.Stop ? SSEContentDisable : 
            E extends SSEType.End ? SSEContentEnd : unknown
}
