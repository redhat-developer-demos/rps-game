import log from 'barelog'

export const ENDPOINTS = {
  INIT: '/game/init',
  GAME_START: '/admin/game/start',
  GAME_CONTINUE: '/admin/game/continue'
}

export function startGame () {
  return fetch(ENDPOINTS.GAME_START)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`expected 200 response from ${ENDPOINTS.GAME_START}`)
      }
    })
}

export function advanceRound () {
  return fetch(ENDPOINTS.GAME_CONTINUE)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`expected 200 response from ${ENDPOINTS.GAME_CONTINUE}`)
      }
    })
}

export async function getConfigAndState (): Promise<InitResponse> {
  log(`fetching initial config from ${ENDPOINTS.INIT}`)

  const res = await fetch(ENDPOINTS.INIT)
  const data = await res.json() as InitResponse

  log(`response from ${ENDPOINTS.INIT}`, data)

  return data
}

export enum SSEType {
  Start = 'start',
  Stop = 'stop',
  End = 'end',
  Result = 'results',
  UserShape = 'usershape',
  Heartbeat = 'heartbeat'
}

export type Shape = 'ROCK'|'SCISSORS'|'PAPER'
export type GameStatus = 'INIT'|'START'|'END'|'STOP'
export type State = {
  manualRounds: boolean,
  status: GameStatus
}

export type Config = {
  numberOfRounds: number
  roundTimeInSeconds: number
  timeBetweenRoundsInSeconds: number
}

export type InitResponse = {
  configuration: Config
  state: State
}

// Represents the start of a round
export type SSEContentStart = {
  team1Score: number
  team1: { count: number, shape: string }
  team2Score: number
  team2: { count: number, shape: string }
  winner: string
}

// Represents the end of a round
export type SSEContentEnd = object

// Represents the end of the game
export type SSEContentStop = {
  team1Score: number
  team1: { count: number, shape: string }
  team2Score: number
  team2: { count: number, shape: string }
  winner: string
}

export type SSEContentUserShape = {
  shape: Shape
  username: string
}

export type SSEContentResult = {
  roundResult: {
    team1: {count: 0, shape: Shape}
    team2: {count: 0, shape: Shape}
    team1Score: number
    team2Score: number
    winner: TeamId|'TIE'
  }
  topPlayers: string[]
}

export type TeamId = 'TEAM_1'|'TEAM_2'

export type SSE<E extends SSEType|unknown> = {
  type: E,
  content: E extends SSEType.Start ? SSEContentStart : 
            E extends SSEType.Stop ? SSEContentStop : 
            E extends SSEType.Result ? SSEContentResult :
            E extends SSEType.End ? SSEContentEnd : unknown
}