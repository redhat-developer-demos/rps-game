import React, { useEffect, useState } from 'react'
import log from 'barelog'
import { GameRestAPI, GameStateReady, GameStateNotReady } from './types'

export type GameStateContextType = GameStateReady|GameStateNotReady

export const GameStateContext = React.createContext<GameStateContextType>({
  ready: false
});

const GameStateContextProvider: React.FunctionComponent<any> = (props) => {
  const [ ctx, setCtx ] = useState<GameStateContextType>({
    ready: false
  })
  const [ es, setEs ] = useState<EventSource>()

  useEffect(() => {
    async function initAndAssign (): Promise<{ config: GameRestAPI.Config, assignment: GameRestAPI.UserAssignment }> {
      const [ config, assignment ] = await Promise.all([
        // In development mode these requests go to the Vite development server
        // and get proxied to the Quarkus backend. For production, we'll need
        // to configure NGINX to proxy them to the Quarkus Pod/Service
        fetch('/game/init').then(r => r.json() as Promise<GameRestAPI.Config>),
        fetch('/game/assign').then(r => r.json() as Promise<GameRestAPI.UserAssignment>)
      ])
  
      return { config, assignment }
    }

    initAndAssign()
      .then((data) => {
        const _ctx: GameStateReady = {
          config: data.config,
          user: data.assignment,
          ready: true
        }

        log('setting ctx to', _ctx)

        // TODO: remove this delay at some point
        setTimeout(() => setCtx(_ctx), 1000)
      })

    
    log('creating event source')
    // Proxying this via the Vite development server appears to be broken
    // but needs more testing when the backend is easier to control
    const _es = new EventSource('http://localhost:8080/game/stream')

    _es.addEventListener('message', function (event) {
      log('received event:', JSON.parse(event.data))
      // TODO: process server-sent events and add these to the
      // GameStateContext object for use by child components
    });

    _es.addEventListener('error', function (event) {
      log('error occurred:', event)
    });

    _es.addEventListener('open', function (event) {
      log('connection opened')
    })

    _es.addEventListener('close', function (event) {
      log('connection closed')
    })

    setEs(es)
  }, [es])

  return (
    <GameStateContext.Provider value={ctx}>
      {props.children}
    </GameStateContext.Provider>
  )
}

export default GameStateContextProvider;
