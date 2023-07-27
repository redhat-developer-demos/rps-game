import { assign, createMachine, interpret } from 'xstate';
import { randomUUID } from 'crypto'
import { ApiWrapper, Config, MoveProcessResponse, Shape, UserAssignment } from '../api';
import log from '../log';
import { SSEContentDisable, SSEContentEnable, SSEContentEnd } from '../sse';

const shapes = [Shape.Rock, Shape.Paper, Shape.Scissors]

export default function createPlayerMachine (api: ApiWrapper, useImages: boolean) {
  const playerMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbXWAqAYggHtCz8A3VgazBJoseQqXJVa9RggI9M6KuwDaABgC6qtYlAAHVg0X5tIAB6IATADYA7CQAsKgMyWArM4CcKy47uXLAGhAAT0QARkcXEm8XO1CXc08ADlDE92sAX3TAoRwCYk5KajoGfGYwACdy1nKSHRoFADNq1EEMXNECiWLpWVZ5Q01NYz0DXHZjMwRLUJJQ93dzOb9rFXdQyytAkIRk+2s1vxtHR3c7eMzstpF8zHZCTAoAFVYAZReAURZ2AV7+VuE8qRbvh7k9Xh8ZNw+goxvhBuphvpCuMkKYLDZ7E5XB4vD4-FsLO5HCQYpZEtZvHZrOYYo4LiActcgXcwA9nm9PhUqjU6o1mv92jcWWzwe9IXIYcp1ENUSNkUZUZNprN5ot3MtVutNsELCcSCcvOZrNT3IkEuT6YzASQAO7oQqlJjvAByAEEAEIAGXeMt0SMME0QPjsJHMJxciUS8Uc5MSVIJCBjliiKjiliSYescRclqu1tgYBorIoL2w6B0YC+HF+AitHQLRYepfLYHF0IG0oRsv9sMDCCstgczjc6dxvgCOoQdkcti8LlCoS8nnWpzpWQZefrheLzYrTC51Vq9QoTXKLTr+QbO7LFbb-Vh8K03dGKNAkwHmOHOMp+MndjjJLmCoiQnJYTgrE4mTrvgrAQHAxgXkQiIvgqb6IAAtKECboZYuYAh04hFFIpTIfKfbxpO4TEkS-7uC4EbpjSdh4YKzIgsW7IfKRAaKogFHbAkMxxtEfjTs4KgZOuiG2vaVAkc+ZG8VOdEkNYLgqBpkaJBJxrmAmoRZiQwELpYdhhjOEbuCxTIkFeTY3mA3G9kpMQkOq5LqSBFIpBSCaxCoRmuIunhqf+VhQekQA */
    tsTypes: {} as import("./fsm.typegen").Typegen0,
    id: `player-machine-${randomUUID()}`,
    context: { /* initial context is empty */ } as any,
    schema: {
      context: {} as {
        user: UserAssignment,
        config: Config,
        roundInfo: SSEContentEnable,
        processedMoveResponse: MoveProcessResponse,
        // TODO: add extra context, such as results returned by API/SSE
      },
      services: {} as {
        selectShape: {
          data: void
        }
        initAndAssign: {
          data: { config: Config, assignment: UserAssignment }
        }
      },
      events: {} as
        | { type: 'INIT'; }
        | { type: 'START'; data: SSEContentEnable }
        | { type: 'STOP'; data: SSEContentDisable }
        | { type: 'END'; data: SSEContentEnd }
    },
    initial: 'initialising',
    states: {
      initialising: {
        invoke: {
          src: 'initAndAssign',
          onDone: {
            target: 'waiting',
            actions: 'setUserAndConfig'
          },
          onError: {
            target: 'retryInit'
          }
        }
      },
      retryInit: {
        on: { INIT: 'initialising' },
        invoke: {
          src: (ctx, event) => (callback) => {
            log.warn(`init failed for ${playerMachine.id}. retrying init in 5 seconds`)
            setTimeout(() => callback('INIT'), 5000)
          }
        }
      },
      waiting: {
        on: { START: 'selectShape', STOP: 'waiting', END: 'gameOver' }
      },
      selectShape: {
        invoke: {
          src: 'selectShape',
          onDone: {
            target: 'waiting'
          }
        }
      },
      gameOver: {
        // This is the final state. The machine will trigger a registered
        // "onDone" callback when it enters this state. We can clean it up
        // at that point.
        type: 'final'
      }
    }
  }, {
    services: {
      selectShape: async ({ user }) => {

        const shape = shapes[Math.round(Math.random() * (shapes.length - 1))]
        const shapeDelay = Math.random() * 5000
        
        // It's not realistic that all player shapes arrive at the same time.
        // Add random delay to simulate a player "considering" their choice
        await delay(shapeDelay)

        log.info(`player ${user.id} (${user.name}) on team ${user.team} submitting shape ${shape} ${useImages ? 'as an image' : 'as a button selection'}`)

        await api.selectShape({
          userId: user.id,
          team: user.team,
          shape,
          useImages
        })

        log.info(`player ${user.id} (${user.name}) on team ${user.team} shape was accepted`)
      },
      initAndAssign: api.initAndAssign
    },
    actions: {
      setUserAndConfig: assign({
        user: (ctx, event) => event.data.assignment,
        config: (ctx, event) => event.data.config
      })
    }
  });

  return interpret(playerMachine)
}

async function delay (ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}