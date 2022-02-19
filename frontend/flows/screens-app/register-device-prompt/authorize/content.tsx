import { Button } from "components/atoms/button"
import { H5 } from "components/atoms/typography"
import { DropdownMenu } from "components/molecules/menu"
import { useAuthorization } from "frontend/flows/screens-iframe/nfid-login/hooks"
import { useMultipass } from "frontend/hooks/use-multipass"
import { useAccount } from "frontend/services/identity-manager/account/hooks"
import { usePersona } from "frontend/services/identity-manager/persona/hooks"
import { Label, Loader, MenuItem } from "frontend/ui-kit/src"
import React from "react"
import { useNavigate, useParams } from "react-router"
import { LinkIIAnchorHref } from "../../link-ii-anchor/routes"
import { ProfileConstants } from "../../profile/routes"
import { useRegisterDevicePromt } from "../hooks"

interface AuthorizeAppContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  iframe?: boolean
  handleIILink?: () => void
}

export const AuthorizeAppContent: React.FC<AuthorizeAppContentProps> = ({
  children,
  className,
  iframe = false,
  handleIILink,
}) => {
  const [status, setStatus] = React.useState<
    "initial" | "loading" | "success" | "error"
  >("initial")
  const { secret, scope } = useParams()
  const { applicationName } = useMultipass()

  const { userNumber } = useAccount()
  const navigate = useNavigate()
  const { remoteLogin, sendWaitForUserInput } = useRegisterDevicePromt()
  const { authorizeApp } = useAuthorization({
    userNumber,
  })
  const { nextPersonaId, nfidPersonas, iiPersonas, createPersona } =
    usePersona()

  React.useEffect(() => {
    secret && sendWaitForUserInput(secret)
  }, [iiPersonas, nfidPersonas, secret, sendWaitForUserInput])

  const [selectedItem, setSelectedItem] = React.useState<string>(
    nfidPersonas[0].persona_id,
  )
  const [isPersonaSelected, setIsPersonaSelected] = React.useState(true)

  const handleAuthorizePersona = React.useCallback(
    ({ persona_id }: { persona_id?: string; anchor?: string }) =>
      async () => {
        setStatus("loading")
        if (!secret || !scope || !persona_id)
          throw new Error("missing secret, scope or persona_id")
        await remoteLogin({ secret, scope, persona_id })
        return navigate(`${ProfileConstants.authenticate}`)
      },
    [navigate, remoteLogin, secret, scope],
  )

  const handleAuthorizeIIPersona = React.useCallback(
    ({ anchor }) =>
      async () => {
        setStatus("loading")
        await authorizeApp({ anchor })
        setStatus("success")
      },
    [authorizeApp],
  )

  const handleCreatePersonaAndLogin = React.useCallback(async () => {
    setStatus("loading")

    const response = await createPersona({ domain: scope })

    if (response?.status_code === 200) {
      return handleAuthorizePersona({ persona_id: nextPersonaId })()
    }
  }, [createPersona, handleAuthorizePersona, nextPersonaId, scope])

  const handleLogin = React.useCallback(async () => {
    if (isPersonaSelected) {
      await handleAuthorizePersona({
        persona_id: selectedItem,
      })()
    }

    if (!isPersonaSelected) {
      await handleAuthorizeIIPersona({
        anchor: selectedItem,
      })()
    }
  }, [
    handleAuthorizeIIPersona,
    handleAuthorizePersona,
    isPersonaSelected,
    selectedItem,
  ])

  return status === "initial" || status === "loading" ? (
    <div>
      <H5 className="mb-4">Log in to {applicationName}</H5>

      <div className="mb-5">
        <Label>Continue as</Label>
        <DropdownMenu title={selectedItem}>
          {(toggle) => (
            <>
              <Label menuItem>Personas</Label>
              {nfidPersonas.map((persona, index) => (
                <MenuItem
                  key={index}
                  title={persona.persona_id}
                  onClick={() => {
                    setSelectedItem(persona.persona_id)
                    setIsPersonaSelected(true)
                    toggle()
                  }}
                />
              ))}

              <Label menuItem>Anchors</Label>
              {iiPersonas.map((persona, index) => (
                <MenuItem
                  key={index}
                  title={persona.anchor}
                  onClick={() => {
                    setSelectedItem(persona.anchor)
                    setIsPersonaSelected(false)
                    toggle()
                  }}
                />
              ))}
            </>
          )}
        </DropdownMenu>
      </div>

      <Button secondary block onClick={handleLogin}>
        Log in
      </Button>
      <Button text block onClick={handleCreatePersonaAndLogin}>
        Create a new account
      </Button>

      <LinkIIAnchorHref onClick={handleIILink} />

      <Loader isLoading={status === "loading"} iframe={iframe} />
    </div>
  ) : null
}
