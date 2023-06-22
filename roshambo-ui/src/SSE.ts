
import { Observable, multicast } from "observable-fns"
import { SSE } from "./Api"
import log from 'barelog'

/**
 * This function creates an Observable that emits payloads received from an
 * SSE connection to the server. It will transparently handle connection 
 * errors and reconnect attempts.
 * @returns Observable<SSE<unknown>>
 */
export default function getEventSource (): Observable<SSE<unknown>> {
  return multicast(new Observable<SSE<unknown>>(observer => {
    function createEventSource () {
      const es = new EventSource('/game/stream')

      es.addEventListener('open', (event) => {
        log('SSE "open" event', event)
      })
      
      es.addEventListener('error', (event) => {
        log('SSE "error" event', event)
        observer.error(event)
        es.close()
      })
  
      es.addEventListener('close', (event) => {
        log('SSE "close" event', event)
        observer.error(event)

        setTimeout(() => {
          log('creating new event source in 1 second')
          createEventSource()
        }, 1000)
      })

      es.addEventListener('message', (event) => {
        log('SSE "message" event', event)
        log('SSE "message" event.data', event.data)
        try {
          observer.next(JSON.parse(event.data))
        } catch (e) {
          log('error parsing received event:', event)
        }
      })
    }

    createEventSource()
  }))
}
