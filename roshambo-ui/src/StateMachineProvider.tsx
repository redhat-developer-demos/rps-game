import { createContext, useEffect } from "react";
import getStateMachine from "./StateMachine";
import { useMachine } from "@xstate/react";
import log from 'barelog'
import { SSEType, SSEContentEnable, SSEContentDisable, SSEContentEnd, SSE } from "./Api";

const { service, machine } = getStateMachine()

export const StateMachineContext = createContext(service);

const StateMachineContextProvider: React.FunctionComponent<{ children: JSX.Element }> = (props) => {
  // When built for production, the useMachine line throws an error that a
  // second parameter is required. Not sure why...
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [ , send, interpreter ] = useMachine(machine);
  // TODO: is this the right place for this? The events need to go thru
  // the send function here, and not the service.send to ensure state
  // updates are triggered
  useEffect(() => {
    let es!: EventSource
    let connectionTimeoutTimer!: ReturnType<typeof setTimeout>

    // Establish initial EventSource connectivity
    setupEventSource()

    function setupEventSource (): EventSource {
      es = new EventSource('/game/stream')

      es.addEventListener('open', (event) => {
        log('SSE "open" event', event)

        resetConnectionTimeout()
      })
      
      es.addEventListener('error', (event) => {
        log('SSE "error" event received. Closing connection and reconnecting in 1 second', event)
        
        // Remove any existing connection timeout timer
        clearTimeout(connectionTimeoutTimer)
        
        // If the connection isn't closed, close it
        if (es.readyState !== EventSource.CLOSED) {
          es.close()
        }

        // Attempt to reconnect in 1 second
        setTimeout(() => setupEventSource(), 1000)
      })

      es.addEventListener('message', parseMessage)

      /**
       * The backend sends a heartbeat every 10 seconds. If we do not receive
       * a heartbeat after some time, disconnect and attempt to reconnect.
       */
      function resetConnectionTimeout () {
        log('SSE resetting connection timeout')

        clearTimeout(connectionTimeoutTimer)

        // Establish a new connection timeout
        connectionTimeoutTimer = setTimeout(() => {
          log('SSE connection will be closed due to timeout')
          setupEventSource()
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
            processMessage(data)
          }

        } catch (e) {
          log('error parsing received event:', event)
        }
      }

      return es
    }

    function processMessage (message: SSE<unknown>) {
      switch (message.type) {
        case SSEType.Enable:
          send({
            type: 'ENABLE',
            data: message.content as SSEContentEnable
          })
          break;
        case SSEType.Disable:
          send({
            type: 'DISABLE',
            data: message.content as SSEContentDisable
          })
          break;
        case SSEType.End:
          send({
            type: 'END',
            data: message.content as SSEContentEnd
          })
          break;
        default:
          log('SSE received unrecognised message type: ', message)
          break;
      }
    }

    // Technically this isn't too important since this component is never
    // really unmounted, but if React strict mode is enabled we'd end up with
    // two SSE connections, which could get funky...
    return function cleanUpSSE () {
      log('SSE performing clean up due to component unmounting')

      clearTimeout(connectionTimeoutTimer)

      if (es && es.readyState !== EventSource.CLOSED) {
        es.close()
      }
    }
  }, [send])

  return (
    <StateMachineContext.Provider value={interpreter}>
      {props.children}
    </StateMachineContext.Provider>
  );
}


export default StateMachineContextProvider