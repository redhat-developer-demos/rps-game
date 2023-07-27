
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.(machine).initialising:invocation[0]": { type: "done.invoke.(machine).initialising:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.(machine).initialising:invocation[0]": { type: "error.platform.(machine).initialising:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "initAndAssign": "done.invoke.(machine).initialising:invocation[0]";
"selectShape": "done.invoke.(machine).selectShape:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "setUserAndConfig": "done.invoke.(machine).initialising:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "initAndAssign": "INIT" | "xstate.init";
"selectShape": "START";
        };
        matchesStates: "gameOver" | "initialising" | "retryInit" | "selectShape" | "waiting";
        tags: never;
      }
  