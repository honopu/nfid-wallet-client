import { useActor } from "@xstate/react"

import { Loader } from "@internet-identity-labs/nfid-sdk-react"

import { RegistrationActor } from "frontend/state/machines/authentication/registration"
import { UnknownDeviceActor } from "frontend/state/machines/authentication/unknown-device"
import { AuthorizeDecider } from "frontend/ui/pages/authorize-decider"

import { RegistrationCoordinator } from "./registration"

export function UnknownDeviceCoordinator({ actor }: Actor<UnknownDeviceActor>) {
  const [state, send] = useActor(actor)

  switch (true) {
    case state.matches("ExistingAnchor"):
    case state.matches("AuthSelection"):
    case state.matches("AuthWithGoogle"):
      return (
        <AuthorizeDecider
          onSelectRemoteAuthorization={() => send("AUTH_WITH_REMOTE")}
          onSelectSameDeviceRegistration={() =>
            console.log("VOID: SAME DEVICE")
          }
          onSelectSameDeviceAuthorization={() =>
            console.log("VOID: SAME DEVICE AUTHO")
          }
          onSelectGoogleAuthorization={({ credential }) =>
            send({ type: "AUTH_WITH_GOOGLE", data: credential as string })
          }
          onSelectSecurityKeyAuthorization={() =>
            console.log("VOID: SECURITY KEY")
          }
          onToggleAdvancedOptions={() => send("AUTH_WITH_OTHER")}
          showAdvancedOptions={state.matches("ExistingAnchor")}
          isLoading={state.matches("AuthWithGoogle")}
        />
      )
    case state.matches("RegistrationMachine"):
      return (
        <RegistrationCoordinator
          actor={state.children.registration as RegistrationActor}
        />
      )
    case state.matches("RemoteAuthentication"):
      return <>TODO: Remote Auth Coordinator</>
    // case state.matches("RegisterDeviceDecider"):
    //   return <>Trust this device?</>
    case state.matches("RegisterDevice"):
      return <>Registering...</>
    case state.matches("RegisterDeviceError"):
      return <>There was an error registering your device</>
    case state.matches("End"):
    case state.matches("Start"):
    default:
      return <Loader isLoading={true} />
  }
}
