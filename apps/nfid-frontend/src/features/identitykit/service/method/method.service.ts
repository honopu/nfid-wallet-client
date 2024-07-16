import { IdentityKitRPCMachineContext } from "../../type"
import { NotSupportedError } from "../exception-handler.service"
import { utilsService } from "../utils.service"
import { icrc27AccountsMethodService } from "./interactive/icrc27-accounts-method.service"
import { icrc34DelegationMethodService } from "./interactive/icrc34-delegation-method.service"
import { InteractiveMethodService } from "./interactive/interactive-method.service"
import { icrc25PermissionsMethodService } from "./silent/icrc25-permissions-method.service"
import { icrc25RequestPermissionsMethodService } from "./silent/icrc25-request-permissions-method.service"
import { icrc25SupportedStandardsMethodService } from "./silent/icrc25-supported-standards-method.service"
import { icrc29GetStatusMethodService } from "./silent/icrc29-get-status-method.service"
import { SilentMethodService } from "./silent/silent-method.service"

export interface MethodService {
  getMethod(): string
  requiresAuthentication(): boolean
}

export const silentMethodServices: Map<string, SilentMethodService> =
  utilsService.mapByKey(
    (x) => x.getMethod(),
    [
      icrc25RequestPermissionsMethodService,
      icrc25PermissionsMethodService,
      icrc25SupportedStandardsMethodService,
      icrc29GetStatusMethodService,
    ],
  )

export const interactiveMethodServices: Map<string, InteractiveMethodService> =
  utilsService.mapByKey(
    (x) => x.getMethod(),
    [icrc27AccountsMethodService, icrc34DelegationMethodService],
  )

export const validateRequest = async (
  context: IdentityKitRPCMachineContext,
) => {
  if (!context.activeRequest) throw new Error("No active requests")
  if (!context.activeRequest.data.method) throw new Error("No method")

  const isSilent = silentMethodServices.has(context.activeRequest.data.method)
  const service = isSilent
    ? silentMethodServices.get(context.activeRequest.data.method)
    : interactiveMethodServices.get(context.activeRequest.data.method)

  if (!service) throw new NotSupportedError()

  return {
    isSilent,
    requiresAuthentication: service?.requiresAuthentication(),
  }
}

export const executeSilentMethod = async (
  context: IdentityKitRPCMachineContext,
) => {
  if (!context.activeRequest) throw new Error("No active request")
  const service = silentMethodServices.get(context.activeRequest.data.method)
  if (!service) throw new NotSupportedError()
  return service.executeMethod(context.activeRequest)
}

export const getInteractiveMethodData = async (
  context: IdentityKitRPCMachineContext,
) => {
  if (!context.activeRequest) throw new Error("No active request")
  const service = interactiveMethodServices.get(
    context.activeRequest.data.method,
  )
  if (!service) throw new NotSupportedError()
  return service.invokeAndGetComponentData(context.activeRequest)
}

export const executeInteractiveMethod = async (
  context: IdentityKitRPCMachineContext,
  event: { type: string; data?: unknown },
) => {
  if (!context.activeRequest) throw new Error("No active request")
  const service = interactiveMethodServices.get(
    context.activeRequest.data.method,
  )
  if (!service) throw new NotSupportedError()
  return service.onApprove(context.activeRequest, event.data)
}
