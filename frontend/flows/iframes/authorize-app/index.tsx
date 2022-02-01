import React from "react"
import { useAuthorization } from "../nfid-login/hooks"
import { usePersona } from "frontend/services/identity-manager/persona/hooks"
import { IFrameScreen } from "frontend/design-system/templates/IFrameScreen"
import { Button } from "frontend/ui-kit/src/components/atoms/button"
import { useAccount } from "frontend/services/identity-manager/account/hooks"
import { Loader } from "frontend/ui-kit/src"
import { useIsLoading } from "frontend/hooks/use-is-loading"

interface AuthorizeAppProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const AuthorizeApp: React.FC<AuthorizeAppProps> = () => {
  const { isLoading, setIsloading } = useIsLoading()
  const { userNumber, account } = useAccount()
  const { createPersona } = usePersona()

  const { authorizationRequest, authorizeApp } = useAuthorization({
    userNumber,
  })

  const { nextPersonaId, nfidPersonas, iiPersonas } = usePersona({
    application: authorizationRequest?.hostname,
  })

  const handleCreatePersona = React.useCallback(
    async ({ domain }) => {
      setIsloading(true)
      await createPersona({ domain })
      await authorizeApp({ persona_id: nextPersonaId })
      setIsloading(false)
    },
    [authorizeApp, createPersona, nextPersonaId, setIsloading],
  )

  return (
    <IFrameScreen title={account && `Welcome ${account.name}`}>
      <div className="px-6 py-4">
        {nfidPersonas?.map(({ persona_id }) => (
          <Button
            key={persona_id}
            block
            filled
            onClick={() => authorizeApp({ persona_id })}
            className="mt-1"
          >
            Continue as NFID persona {persona_id}
          </Button>
        ))}
        <Button
          block
          filled
          color="white"
          onClick={() =>
            handleCreatePersona({ domain: authorizationRequest?.hostname })
          }
          className="mt-1"
        >
          Create new persona
        </Button>
      </div>
      <div className="px-6 py-4">
        {iiPersonas?.map(({ anchor }) => (
          <Button
            key={anchor}
            block
            filled
            onClick={() => authorizeApp({ anchor })}
            className="mt-1"
          >
            Continue as NFID persona {anchor}
          </Button>
        ))}
      </div>
      <Loader isLoading={isLoading} />
    </IFrameScreen>
  )
}
