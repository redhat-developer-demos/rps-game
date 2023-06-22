import { createContext, useEffect } from "react";
import getStateMachine from "./StateMachine";
import { useMachine } from "@xstate/react";
import getEventSource from "./SSE";
import log from 'barelog'
import { SSEType, SSEContentEnable, SSEContentDisable, SSEContentEnd } from "./Api";

const { service, machine } = getStateMachine()

export const StateMachineContext = createContext(service);

const StateMachineContextProvider: React.FunctionComponent<{ children: JSX.Element }> = (props) => {
  const [ , send, interpreter ] = useMachine(machine);

  // TODO: is this the right place for this? The events need to go thru
  // the send function here, and not the service.send to ensure state
  // updates are triggered
  useEffect(() => {
    getEventSource().subscribe(
      (message) => {
        log('SM received SSE message', message)
        if (message.type === SSEType.Enable) {
          send({
            type: 'ENABLE',
            data: message.content as SSEContentEnable
          })
        } else if (message.type === SSEType.Disable) {
          send('DISABLE', message.content as SSEContentDisable)
        } else if (message.type === SSEType.End) {
          send('END', message.content as SSEContentEnd)
        } else {
          log('received unrecognised SSE type: ', message)
        }
      },
      (error) => {
        log('error received from SSE:', error)
        send({
          type: 'PAUSE',
          data: 'Reconnecting'
        })
      }
    )
  }, [send])

  return (
    <StateMachineContext.Provider value={interpreter}>
      {props.children}
    </StateMachineContext.Provider>
  );
}

export default StateMachineContextProvider