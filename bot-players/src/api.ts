import log from "./log"
import { request } from 'undici'

export default function getApiWrapper (baseUrl: string): ApiWrapper {

  async function initAndAssign (): Promise<{ config: Config, assignment: UserAssignment }> {
    log.debug(`performing initial config and user assignment calls to ${baseUrl}`)

    const [ config, assignment ] = await Promise.all([
      // In development mode these requests go to the Vite development server
      // and get proxied to the Quarkus backend. For production, we'll need
      // to configure NGINX to proxy them to the Quarkus Pod/Service
      request(new URL('/game/init', baseUrl).toString()).then(r => r.body.json() as Promise<Config>),
      request(new URL('/game/assign', baseUrl).toString()).then(r => r.body.json() as Promise<UserAssignment>)
    ])
  
    return { config, assignment }
  }
  
  async function selectShape (params: { team: TeamNumber, userId: number, move: Shape }): Promise<void> {
    const path = `/game/detect/button/${params.team}/${params.userId}/${params.move}`
    const url = new URL(path, baseUrl).toString()

    log.debug(`performing shape selection: ${path}`)

    try {
      const { statusCode } = await request(url, { method: 'POST' })

      if (statusCode !== 200) {
        throw new Error(`received status code ${statusCode}`)
      }
    } catch (e) {
      log.error('error performing shape selection:', e)
    }
  }

  return {
    initAndAssign,
    selectShape
  }
}

export type ApiWrapper = {
  initAndAssign (): Promise<{ config: Config, assignment: UserAssignment }>,
  selectShape (params: { team: TeamNumber, userId: number, move: Shape }): Promise<void>
}

export type TeamNumber = 1|2

export type UserAssignment = {
  id: number
  name: string
  team: TeamNumber
}

export type Config = {
  numberOfRounds: number,
  roundTimeInSeconds: number,
  timeBetweenRoundsInSeconds: number
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