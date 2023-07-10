
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.(machine).INITIAL:invocation[0]": { type: "done.invoke.(machine).INITIAL:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.(machine).INITIAL:invocation[0]": { type: "error.platform.(machine).INITIAL:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "getConfig": "done.invoke.(machine).INITIAL:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "setCameraAccess": "CAMERA_ACCESS";
"setConfig": "done.invoke.(machine).INITIAL:invocation[0]";
"setEndResult": "END";
"setProcessedMoveResponse": "MOVE_PROCESSED";
"setRoundInfo": "ENABLE";
"setRoundResult": "DISABLE";
"setWaitingMessage": "PAUSE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "getConfig": "error.platform.(machine).INITIAL:invocation[0]" | "xstate.init";
        };
        matchesStates: "GAME_OVER" | "INITIAL" | "MOVE_RESULT" | "PAUSED" | "PLAY" | "READY" | "ROUND_RESULT";
        tags: never;
      }
  