

export async function initAndAssign (): Promise<{ config: InitResponse, user: UserAssignment }> {
  const [ config, assignment ] = await Promise.all([
    // In development mode these requests go to the Vite development server
    // and get proxied to the Quarkus backend. For production, we'll need
    // to configure NGINX to proxy them to the Quarkus Pod/Service
    fetch('/game/init').then(r => r.json() as Promise<InitResponse>),
    fetch('/game/assign').then(r => r.json() as Promise<UserAssignment>)
  ])

  return new Promise((resolve) => {
    setTimeout(() => resolve({ config, user: assignment }), 1000);
  })
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

export type SSEContent = SSEContentDisable|SSEContentEnable|SSEContentEnd

export type SSE<E extends SSEType|unknown> = {
  type: E,
  content: E extends SSEType.Enable ? SSEContentEnable : 
            E extends SSEType.Disable ? SSEContentDisable : 
            E extends SSEType.End ? SSEContentEnd : unknown
}