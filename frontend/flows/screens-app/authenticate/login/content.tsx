import { Button } from "components/atoms/button"
import { H2, H5 } from "components/atoms/typography"
import { IFrameAuthorizeAppConstants as IFrameAuthorize } from "frontend/flows/screens-iframe/authorize-app/routes"
import { IFrameProfileConstants as IFrameProfile } from "frontend/flows/screens-iframe/personalize/routes"
import { useAuthentication } from "frontend/hooks/use-authentication"
import { useAccount } from "frontend/services/identity-manager/account/hooks"
import { Loader, P } from "frontend/ui-kit/src"
import React from "react"
import { useNavigate } from "react-router-dom"
import { ProfileConstants as profile } from "../../profile/routes"
import { ImageNFIDLogin } from "../image"

interface AuthenticateNFIDLoginContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  iframe?: boolean
}

export const AuthenticateNFIDLoginContent: React.FC<
  AuthenticateNFIDLoginContentProps
> = ({ children, className, iframe }) => {
  const { account } = useAccount()
  const { isLoading, login } = useAuthentication()
  const navigate = useNavigate()

  const handleUnlock = React.useCallback(async () => {
    await login()

    if (account && account.skipPersonalize) {
      iframe ? navigate(`${IFrameAuthorize.base}`) : alert("skipPersonalize") // TODO: navigate to AuthorizeApp
    }

    if (account && !account.skipPersonalize) {
      iframe
        ? navigate(`${IFrameProfile.base}/${IFrameProfile.personalize}`)
        : navigate(`${profile.base}/${profile.personalize}`)
    }
  }, [account, iframe, login, navigate])

  const title = "Unlock your NFID"

  return (
    <>
      <div>
        {iframe ? (
          <H5 className="mb-3">{title}</H5>
        ) : (
          <H2 className="my-6">{title}</H2>
        )}

        <P>
          The NFID on this device can only be unlocked by{" "}
          {account?.name || account?.anchor}.
        </P>
        <Button
          large={!iframe}
          block={iframe}
          secondary
          className="mt-8"
          onClick={handleUnlock}
        >
          Unlock as {account?.name || account?.anchor}
        </Button>

        <Loader isLoading={isLoading} />
      </div>

      <ImageNFIDLogin />
    </>
  )
}
