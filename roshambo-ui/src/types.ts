
export type GameStateNotReady = {
  ready: false
}

export type GameStateReady = {
  ready: true,
  config: GameRestAPI.Config
  user: GameRestAPI.UserAssignment
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GameRestAPI {
  export type UserAssignment = {
    id: number
    name: string
    team: 1|2
  }

  export type Config = {
    numberOfRounds: number,
    roundTimeInSeconds: number,
    timeBetweenRoundsInSeconds: number
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
}