import React from "react"
import { useParams } from "react-router-dom"

import { AuthorizeApp } from "frontend/design-system/pages/authorize-app"
import { ScreenResponsive } from "frontend/design-system/templates/screen-responsive"

import { useAuthentication } from "frontend/apps/authentication/use-authentication"
import { useAuthorization } from "frontend/apps/authorization/use-authorization"
import { useAuthorizeApp } from "frontend/apps/authorization/use-authorize-app"
import { useIsLoading } from "frontend/design-system/templates/app-screen/use-is-loading"
import { useMultipass } from "frontend/apps/identity-provider/use-app-meta"
import { useAccount } from "frontend/comm/services/identity-manager/account/hooks"
import { usePersona } from "frontend/comm/services/identity-manager/persona/hooks"

export const Authenticate: React.FC<{ machine: any }> = ({ machine }) => {
  const { userNumber } = useAccount()
  const { isLoading, setIsloading } = useIsLoading()
  const { secret, scope } = useParams()
  const { nextPersonaId, accounts, createPersona, getPersona } = usePersona()
  const { remoteNFIDLogin } = useAuthorizeApp()
  const { user, login } = useAuthentication()
  const { applicationName, applicationLogo } = useMultipass()

  const { authorizeApp, opener, authorizationRequest, postClientReadyMessage } =
    useAuthorization({
      userNumber,
    })

  React.useEffect(() => {
    getPersona()
  }, [getPersona])

  const isNFID = React.useMemo(() => scope === "NFID", [scope])

  const handleNFIDLogin = React.useCallback(async () => {
    if (!secret) throw new Error("secret is missing from params")
    await remoteNFIDLogin({ secret })
    setIsloading(false)
  }, [remoteNFIDLogin, secret, setIsloading])

  React.useEffect(() => {
    if (!authorizationRequest && opener) {
      return postClientReadyMessage()
    }
  }, [authorizationRequest, opener, postClientReadyMessage])

  React.useEffect(() => {
    isNFID && user && handleNFIDLogin()
  }, [isNFID, user, handleNFIDLogin])

  const handleLogin = React.useCallback(
    async (personaId: string) => {
      setIsloading(true)
      await authorizeApp({ persona_id: personaId })
      setIsloading(false)
    },
    [authorizeApp, setIsloading],
  )

  const handleCreateAccountAndLogin = React.useCallback(async () => {
    setIsloading(true)
    const response = await createPersona({
      domain: scope || authorizationRequest?.hostname,
    })

    if (response?.status_code === 200) {
      return handleLogin(nextPersonaId)
    }
    setIsloading(false)
  }, [
    authorizationRequest?.hostname,
    createPersona,
    handleLogin,
    nextPersonaId,
    scope,
    setIsloading,
  ])

  return (
    <ScreenResponsive
      isLoading={isLoading}
      className="flex flex-col items-center"
    >
      <AuthorizeApp
        isRemoteAuthorisation
        isAuthenticated={!!user}
        applicationName={applicationName || ""}
        applicationLogo={applicationLogo}
        onUnlockNFID={login}
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccountAndLogin}
        accounts={accounts}
      />
    </ScreenResponsive>
  )
}
