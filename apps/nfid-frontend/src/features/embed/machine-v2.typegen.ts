// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true
  internalEvents: {
    "": { type: "" }
    "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]": {
      type: "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
      data: unknown
      __tip: "See the XState TS docs to learn how to strongly type this."
    }
    "done.invoke.NFIDEmbedMachineV2.AUTH.TrustDevice:invocation[0]": {
      type: "done.invoke.NFIDEmbedMachineV2.AUTH.TrustDevice:invocation[0]"
      data: unknown
      __tip: "See the XState TS docs to learn how to strongly type this."
    }
    "xstate.init": { type: "xstate.init" }
    "xstate.stop": { type: "xstate.stop" }
  }
  invokeSrcNameMap: {
    AuthenticationMachine: "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
    RPCReceiver: "done.invoke.NFIDEmbedMachineV2.RPC_RECEIVER:invocation[0]"
    TrustDeviceMachine: "done.invoke.NFIDEmbedMachineV2.AUTH.TrustDevice:invocation[0]"
  }
  missingImplementations: {
    actions: never
    delays: never
    guards: never
    services: never
  }
  eventsCausingActions: {
    assignAuthSession: "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
    assignProcedure: "PROCEDURE_CALL"
    nfid_authenticated:
      | ""
      | "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
      | "done.invoke.NFIDEmbedMachineV2.AUTH.TrustDevice:invocation[0]"
    nfid_unauthenticated: "SESSION_EXPIRED" | "xstate.stop"
    queueRequest: "PROCEDURE_CALL"
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {
    isAuthenticated: ""
    isReady: "PROCEDURE_CALL"
    isTrusted: "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
    newRPCMessage: ""
  }
  eventsCausingServices: {
    AuthenticationMachine: "" | "SESSION_EXPIRED"
    RPCReceiver: "PROCEDURE_CALL" | "xstate.init"
    TrustDeviceMachine: "done.invoke.NFIDEmbedMachineV2.AUTH.Authenticate:invocation[0]"
  }
  matchesStates:
    | "AUTH"
    | "AUTH.Authenticate"
    | "AUTH.Authenticated"
    | "AUTH.CheckAuthentication"
    | "AUTH.TrustDevice"
    | "HANDLE_PROCEDURE"
    | "HANDLE_PROCEDURE.AWAIT_PROCEDURE_APPROVAL"
    | "HANDLE_PROCEDURE.ERROR"
    | "HANDLE_PROCEDURE.EXECUTE_PROCEDURE"
    | "HANDLE_PROCEDURE.READY"
    | "HANDLE_PROCEDURE.SEND_RPC_CANCEL_RESPONSE"
    | "HANDLE_PROCEDURE.SEND_RPC_RESPONSE"
    | "RPC_RECEIVER"
    | {
        AUTH?:
          | "Authenticate"
          | "Authenticated"
          | "CheckAuthentication"
          | "TrustDevice"
        HANDLE_PROCEDURE?:
          | "AWAIT_PROCEDURE_APPROVAL"
          | "ERROR"
          | "EXECUTE_PROCEDURE"
          | "READY"
          | "SEND_RPC_CANCEL_RESPONSE"
          | "SEND_RPC_RESPONSE"
      }
  tags: never
}
