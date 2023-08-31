import { readFileSync } from "fs"
import log from "./log"
import { request } from 'undici'

export type ImageType = 'jpeg'|'png'

export default function getApiWrapper (baseUrl: string, imageType: ImageType = 'jpeg'): ApiWrapper {
  let requestsInFlight = 0

  const shapeBase64: Record<Shape, string> = {
    'PAPER': readFileSync(`./shape-images/paper-base64.${imageType}.txt`, 'utf-8'),
    'SCISSORS': readFileSync(`./shape-images/scissors-base64.${imageType}.txt`, 'utf-8'),
    'ROCK': readFileSync(`./shape-images/rock-base64.${imageType}.txt`, 'utf-8')
  }

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

  async function selectShape (params: SelectShapeParams): Promise<void> {
    requestsInFlight++
    log.info(`number of detection requests in flight (increased): ${requestsInFlight}`)

    const path = params.imageType ? `/game/detect/shot/${params.team}/${params.userId}` : `/game/detect/button/${params.team}/${params.userId}/${params.shape}`
    const url = new URL(path, baseUrl).toString()
    
    try {
      const { statusCode } = await request(url, {
        throwOnError: false,
        method: 'POST',
        headers: {
          'content-type': 'text/plain'
        },
        body: params.imageType ? shapeBase64[params.shape] : undefined
      })

      if (statusCode !== 200) {
        log.error(`received status code ${statusCode}`)
      }
    } catch (e) {
      log.error('error performing shape selection:')
      log.error(e)
    } finally {
      requestsInFlight--
      log.info(`number of detection requests in flight (decreased): ${requestsInFlight}`)
    }
  }

  return {
    initAndAssign,
    selectShape
  }
}

export type SelectShapeParams = {
  team: TeamNumber
  userId: number
  shape: Shape
  imageType?: ImageType
}

export type ApiWrapper = {
  initAndAssign (): Promise<{ config: Config, assignment: UserAssignment }>,
  selectShape (params: SelectShapeParams): Promise<void>
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