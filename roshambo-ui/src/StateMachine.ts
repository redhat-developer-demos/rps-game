import { assign, createMachine, interpret } from "xstate";
import { UserAssignment, Config, SSEContentEnable, SSEContentDisable, SSEContentEnd, MoveProcessResponse } from "./Api";
import { CameraAccessState } from "./Types";

export default function getStateMachine() {
    // Types are generated using the XState VScode plugin!
  const machine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgEkA5MgFTIEEAZAYggHtCSCA3VgazBIAzANoAGALqJQAB1axcAF1zspIAB6JRAGhABPTQF8DOtFjyFSAJQCidACIBNJtYp0AQg2tjJSELPlKKr4aCNp6hkY6+KwQcKqmOATEqv6KyviqIQC0ACwAHDr6CFl5AOwkOaUAnACMAGw5NQBMAMwArO31kSAJ5sTkVLSMKXJpQaAhOU2FiDWlbSRNVS05oqI5OXVtpS15ed29SVa2jiMB6ZmIbRskonUt1XVVVaWiry0zCDV5TSTX9Q1mu1OnUDhhEhYSJYAPIAVQodgA+nQAMK0ABq1jOYwywU0nxadXKSxWaw2Wx2eVBRgMQA */
    tsTypes: {} as import("./StateMachine.typegen").Typegen0,
    predictableActionArguments: true,
    schema: {
      services: {} as {
        getConfig: {
          // The data that gets returned from the service
          data: { user: UserAssignment, config: Config };
        };
      },
      // The context (extended state) of the machine
      context: {} as {
        user: UserAssignment,
        config: Config,
        roundInfo: SSEContentEnable
        waitingMessage: string
        processedMoveResponse: MoveProcessResponse
        cameraAccess: CameraAccessState
        // TODO: add extra context, such as results returned by API/SSE
      },
      // The events this machine handles
      events: {} as
        | { type: 'INIT_ERROR' }
        | { type: 'GET_CONFIG_AND_USER_ASSIGNMENT' }
        | { type: 'CONFIG_RETRIEVED'; config: string }
        | { type: 'CAMERA_ACCESS', state: CameraAccessState }
        | { type: 'PAUSE'; data: string }
        | { type: 'MOVE_PROCESSED'; data: MoveProcessResponse }
        | { type: 'ENABLE'; data: SSEContentEnable }
        | { type: 'DISABLE'; data: SSEContentDisable }
        | { type: 'END'; data: SSEContentEnd }
    },
    initial: 'INITIAL',
    context: {
      cameraAccess: CameraAccessState.Unknown
    } as any, // TODO: Hack...
    states: {
      'INITIAL': {
        invoke: {
          src: 'getConfig',
          onDone: {
            target: 'READY',
            actions: 'setConfig'
          },
          onError: {
            target: 'INITIAL'
          }
        }
      },
      'READY': {
        on: {
          'ENABLE': {
            actions: 'setRoundInfo',
            target: 'PLAY'
          },
          'CAMERA_ACCESS': {
            actions: 'setCameraAccess',
            target: 'READY'
          }
        }
      },
      'PLAY': {
        on: {
          'DISABLE': {
            // TODO: may need to use a "PAUSED" state instead, since we'll
            // have a waiting period in between rounds and it doesn't make
            // sense to show the READY screen instructions again
            target: 'READY'
          },
          'PAUSE': {
            target: 'PAUSED',
            actions: 'setWaitingMessage'
          }
        }
      },
      'PAUSED': {
        // TODO: events that change from paused back to gameplay etc
        on: {
          'DISABLE': {
            target: 'READY'
          },
          'MOVE_PROCESSED': {
            target: 'MOVE_RESULT',
            actions: 'setProcessedMoveResponse'
          }
        }
      },
      'MOVE_RESULT': {
        on: {
          // The move result screen shows the result of backend processing of
          // the image that the user uploaded
          'ENABLE': {
            actions: 'setRoundInfo',
            target: 'PLAY'
          }
        },
      }
    }
  }, {
    services: {
      getConfig: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // TODO remove delay after testing
            initAndAssign().then(resolve).catch(reject)
          }, 1000)
        })
      }
    },
    actions: {
      'setConfig': assign({
        user: (_context, event) => event.data.user,
        config: (_context, event) => event.data.config
      }),
      'setRoundInfo': assign({
        roundInfo: (_context, event) => {
          return event.data
        }
      }),
      'setWaitingMessage': assign({
        waitingMessage: (_context, event) => {
          return event.data
        }
      }),
      setProcessedMoveResponse: assign({
        processedMoveResponse: (_context, event) => {
          return event.data
        }
      }),
      setCameraAccess: assign({
        cameraAccess: (_context, event) => {
          return event.state
        }
      })
    }
  });

  const service = interpret(machine)

  return { service, machine }
}

// TODO: check localStorage for already assigned user and team?
async function initAndAssign (): Promise<{ config: Config, user: UserAssignment }> {
  const [ config, assignment ] = await Promise.all([
    // In development mode these requests go to the Vite development server
    // and get proxied to the Quarkus backend. For production, we'll need
    // to configure NGINX to proxy them to the Quarkus Pod/Service
    fetch('/game/init').then(r => r.json() as Promise<Config>),
    fetch('/game/assign').then(r => r.json() as Promise<UserAssignment>)
  ])

  return { config, user: assignment }
}