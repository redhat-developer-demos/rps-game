import { assign, createMachine, interpret } from "xstate";
import { Config, GameStatus, InitResponse, SSEContentEnd, SSEContentResult, SSEContentStart, SSEContentStop, SSEContentUserShape, TeamId, getConfigAndState } from "./Api";

export default function getStateMachine() {
    // Types are generated using the XState VScode plugin!
  const machine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgEkA5MgFTIEEAZAYggHtCSCA3VgazBJoseQqUo16DBN1aZ0AF1zsA2gAYAumvWJQAB1axci9jpAAPRAA5VAVhIB2AGwBmVQCZLzgJxuvlywAsADQgAJ6Ibr4kjvYAjJb2ifaqAfFujgC+GSFCOATE5FS0jExgAE5lrGUkugA2CgBmVaiCGHmihRKM0vg8csb4Wlqm+oYDphYIjm72JDY+AS6qsbEBnrEh4Qix9nY2sTaOBzZuNs6p9s5ZOW0iBQBKAKJ0ACIAmkwAytR099TDSBAoyMSnwEys8TmzkcAWcuzhkVOmyszhIqxsnjWAQ8nmuIFyd1IAAUGHQPt8APJEgF6AwgkyAybWOxOVweby+fzBMKIHZeEhuVSYlKOIVXbL4275UhPT4AVQY1C+Pz+NKBdPGjN5Jzmlnm0M8jmm0McyIQkTsyxSgr8+0sfjceIJ0pIsoVSseFBeauBmtAkwObl1+schuNRrNlliJAC9i8sVDO2mCecNidUo6AHE6ABZR4AfQpADVHvdlb9-hoRhrQeCEAEbHY9akjV4jZ53M5I9HY-HE043Cm03j8KwIHBTM7RNWxrWtQgALSmnmLzISqcFcTFBgz+lg+dHVHeZxuWGqUVebFmyKzLxxVOxZwJO+qcU3YQup6vN67v3mRB3o4JCqLs+zQs4j7nG4ZppGiXhnLY54QZYHjph+HQkmSv5zv6iBGqo0QnNCOwPic9gwbEQbLE+gTwe4Hh+Gh7QPI88qKthDK4fW0Eris0bxLY+xHKG8FHExhIkNmeaFiW9wcfuXEQQRlE2MsviuJcNixjBKQOI4hz2AEl7Yti9pZFkQA */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tsTypes: {} as import("./StateMachine.typegen").Typegen0,
    predictableActionArguments: true,
    schema: {
      services: {} as {
        getConfig: {
          // The data that gets returned from the service
          data: InitResponse
        };
      },
      // The context (extended state) of the machine
      context: {} as {
        config: Config
        endResult: TeamId|'TIE'
        initialState: GameStatus
        roundResults: SSEContentResult[]
        userActions: SSEContentUserShape[]
      },
      // The events this machine handles
      events: {} as
        | { type: 'INIT_ERROR' }
        | { type: 'INIT' }
        | { type: 'READY'; config: string }
        | { type: 'START'; data: SSEContentStart }
        | { type: 'STOP'; data: SSEContentStop }
        | { type: 'END'; data: SSEContentEnd }
        | { type: 'RESULT'; data: SSEContentResult }
        | { type: 'USER_SHAPE'; data: SSEContentUserShape }
    },
    initial: 'INITIAL',
    states: {
      INITIAL: {
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
      READY: {
        on: {
          START: {
            target: 'PLAY',
            actions: ['resetUserShapes']
          }
        }
      },
      PLAY: {
        on: {
          STOP: {
            target: 'STOPPED',
            actions: ['resetUserShapes']
          },
          USER_SHAPE: {
            actions: 'updateUserShapes',
            internal: true
          }
        }
      },
      // State used in between rounds
      STOPPED: {
        on: {
          START: {
            target: 'PLAY'
          },
          RESULT: {
            actions: 'setRoundResult',
            internal: true
          },
          END: {
            target: 'GAME_OVER',
            actions: 'setEndResult'
          }
        }
      },
      GAME_OVER: {
        // This allows players to join a new game without refreshing
        on: {
          START: {
            target: 'PLAY'
          }
        }
      }
    }
  }, {
    services: {
      getConfig: () => {
        return getConfigAndState()
      }
    },
    actions: {
      updateUserShapes: assign({
        userActions: (ctx, event) => [...ctx.userActions, event.data]
      }),
      resetUserShapes: assign({
        userActions: () => []
      }),
      setConfig: assign({
        config: (_ctx, event) => event.data.configuration,
        initialState: (_ctx, event) => event.data.state.status
      }),
      setRoundResult: assign({
        roundResults: (_ctx, event) => {
          if (_ctx.roundResults) {
            return [..._ctx.roundResults, event.data]
          } else {
            return [event.data]
          }
        }
      }),
      setEndResult: assign({
        endResult: (ctx) => {
          const counts = ctx.roundResults.reduce((counters, current) => {
            if(current.roundResult.winner !== 'TIE') {
              counters[current.roundResult.winner] += 1
            }

            return counters
          }, {
            'TEAM_1': 0,
            'TEAM_2': 0
          })

          if (counts['TEAM_1'] > counts['TEAM_2']) {
            return 'TEAM_1'
          } else if (counts['TEAM_2'] > counts['TEAM_1']) {
            return 'TEAM_2'
          } else {
            return 'TIE'
          }
        }
      })
    }
  });

  // The next line throws a "Some implementations missing" error. Doesn't seem
  // to have an effect on runtime, but something to look into...
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const service = interpret(machine)

  return { service, machine }
}
