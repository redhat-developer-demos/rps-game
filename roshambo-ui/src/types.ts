
// export type GameStateBase = {
//   ready: boolean

//   // Retrieved on startup by an init call
//   config?: Config

//   // Retrieved on startup by an assign call
//   user?: UserAssignment

//   // This data is updated by SSE "end" and "disable" events
//   scores?: ScoreData

//   // This data is set whenever the SSE sends an "enable" events
//   roundInfo?: SSEContentEnable
  
//   // This data is updated by SSE "disable" events
//   lastResult?: SSEContentDisable
// }

// export interface GameStateNotReady extends GameStateBase {
//   ready: false
// }

// export interface GameStateReady extends GameStateBase {
//   ready: true,
//   config: Config
//   user: UserAssignment
//   scores: ScoreData
// }
