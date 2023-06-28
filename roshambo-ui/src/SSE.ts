
import { Observable, multicast } from "observable-fns"
import { SSE, SSEType } from "./Api"
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
      let timer!: ReturnType<typeof setTimeout>

      es.addEventListener('open', (event) => {
        log('SSE "open" event', event)
      })

      es.addEventListener('open', resetConnectionTimeout)
      
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

      es.addEventListener('message', parseMessage)

      /**
       * The backend sends a heartbeat every 10 seconds. If we do not receive
       * a heartbeat after 
       */
      function resetConnectionTimeout () {
        log('SSE resetting connection "heartbeat" timeout')
        if (timer) {
          // Clear the previous connection timeout to prevent
          // accidentally closing it
          clearTimeout(timer)
        }

        // Establish a new connection timeout
        timer = setTimeout(() => {
          log('SSE connection will be closed due to "heartbeat" timeout')
          es.close()
        }, 12000)
      }

      function parseMessage (event: MessageEvent) {
        log('SSE "message" event', event)
        log('SSE "message" event.data', event.data)

        try {
          const data = JSON.parse(event.data) as SSE<unknown>

          if (data.type === SSEType.Heartbeat) {
            log('SEE received "heartbeat"')
            // Heartbeat is a special message type that we use to determine
            // if the connection to the backend is healthy. We could simply
            // reset this upon receiving any message, but the heartbeat is
            // specifically designed for this.
            resetConnectionTimeout()
          } else {
            observer.next(data)
          }

        } catch (e) {
          log('error parsing received event:', event)
        }
      }
    }

    createEventSource()
  }))
}


