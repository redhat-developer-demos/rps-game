
import { Observable, multicast } from "observable-fns"
import { SSE } from "./Api"
import log from 'barelog'

export default function getEventSource () {
  return multicast(new Observable<SSE<unknown>>(observer => {
    function createEventSource () {
      const es = new EventSource('http://localhost:8080/game/stream')

      es.addEventListener('open', (event) => {
        log('SSE "open" event', event)
      })
      
      es.addEventListener('error', (event) => {
        log('SSE "error" event', event)
        es.close()
      })
  
      es.addEventListener('close', (event) => {
        log('SSE "close" event', event)

        setTimeout(() => {
          log('creating new event source in 1 second')
          createEventSource()
        }, 1000)
      })

      es.addEventListener('message', (event) => {
        log('SSE "message" event', event)
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
