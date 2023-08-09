import log from 'barelog'

const STORAGE_KEY = 'init-assign'

export function processHeartBeat (data: SSEContentHeartbeat) {
  const prior = getPriorInitAndAssign();

  if (!prior) {
    // Could happen if SSE connects and receives heartbeat prior to completion
    // of initAndAssign. Messy, but this is fine for now...
    return
  }

  if (data.uuid !== prior.config.configuration.uuid) {
    window.location.href = '/'
  }
}

/**
 * This function initialises the game by retrieving a user ID, name, and team
 * assignment. It checks localStorage for a prior assignment, and verifies that
 * the prior game UUID matches the current UUID returned from the backend. If
 * the UUIDs do not match it requests a new user assignment.
 * 
 * The backend could use probably sessions to simplify this...
 * 
 * @returns 
 */
export async function initAndAssign (): Promise<{ config: InitResponse, user: UserAssignment }> {
  log('getting game configuration and user assignment')
  const priorConfig = getPriorInitAndAssign()

  if (priorConfig) {
    const config = await fetch('/game/init').then(r => r.json() as Promise<InitResponse>)
  
    if (config.configuration.uuid === priorConfig.config.configuration.uuid) {
      // The UUIDs match. We can reuse the existing assignment
      log('reusing existing user assignment')
      return new Promise((resolve) => {
        setTimeout(() => resolve({ config, user: priorConfig.user }), 1000);
      })
    } else {
      // UUID mismatch. Clear stored data and reinitialise
      log('clearing old assignment data and reinitialising')
      localStorage.clear()

      return initAndAssign()
    }
  } else {
    const [ config, assignment ] = await Promise.all([
      // In development mode these requests go to the Vite development server
      // and get proxied to the Quarkus backend. For production, we'll need
      // to configure NGINX to proxy them to the Quarkus Pod/Service
      fetch('/game/init').then(r => r.json() as Promise<InitResponse>),
      fetch('/game/assign').then(r => r.json() as Promise<UserAssignment>)
    ])

    localStorage.setItem(STORAGE_KEY, JSON.stringify({config, user: assignment}))

    return new Promise((resolve) => {
      setTimeout(() => resolve({ config, user: assignment }), 1000);
    })
  }
}

function getPriorInitAndAssign (): undefined|{ config: InitResponse, user: UserAssignment }  {
  try {
    const strData = localStorage.getItem(STORAGE_KEY)
    return strData ? JSON.parse(strData) : undefined
  } catch (e) {
    console.error('failed to read previous init and assign data', e)
  }
}


export type UserAssignment = {
  id: number
  name: string
  team: 1|2
}

export type Config = {
  numberOfRounds: number
  roundTimeInSeconds: number
  timeBetweenRoundsInSeconds: number
  enableCamera: boolean
  uuid: string
}

export type InitResponse = {
  configuration: Config
  state: {
    manualRounds: boolean
    status: 'INIT'|'START'|'STOP'|'END'
  }
}

export type ScoreData = {
  team1Score: number,
  team2Score: number
}

export type MoveProcessResponse = {
  shape: Shape,
  timeInMillis: number
}

export enum Shape {
  Rock = 'ROCK',
  Paper = 'PAPER',
  Scissors = 'SCISSORS'
}

export type ShotResult = {
  timeInMillis: number,
  shape: Shape
}

export enum SSEType {
  Enable = 'start',
  Disable = 'stop',
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
  winner: 'TIE'|'TEAM_1'|'TEAM_2'
}

export type SSEContentEnd = ScoreData

export type SSEContentHeartbeat = {
  uuid: string
}

export type SSEContent = SSEContentDisable|SSEContentEnable|SSEContentEnd|SSEContentHeartbeat

export type SSE<E extends SSEType|unknown> = {
  type: E,
  content: E extends SSEType.Enable ? SSEContentEnable : 
            E extends SSEType.Disable ? SSEContentDisable : 
            E extends SSEType.End ? SSEContentEnd :
            E extends SSEType.Heartbeat ? SSEContentHeartbeat: unknown
}