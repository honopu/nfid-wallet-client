import { Button } from "@internet-identity-labs/nfid-sdk-react"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useAuthentication } from "frontend/hooks/use-authentication"
import { useAccount } from "frontend/services/identity-manager/account/hooks"

interface PopupLoginProps {
  menu?: boolean
}

export const PopupLogin: React.FC<PopupLoginProps> = ({ menu = false }) => {
  const { userNumber, readAccount, account } = useAccount()
  const { login, isRemoteDelegate, isAuthenticated, logout, identityManager } =
    useAuthentication()
  const navigate = useNavigate()

  useEffect(() => {
    isAuthenticated && !isRemoteDelegate && readAccount()
  }, [
    identityManager,
    isAuthenticated,
    isRemoteDelegate,
    readAccount,
    userNumber,
  ])

  return (
    <div className="px-4 mx-auto">
      {!menu && (
        <h2 className="mt-5 text-xl font-bold text-left">
          {!isAuthenticated ? "Welcome " : "Logged in "}
          {account?.name ?? account?.anchor ?? ""}
        </h2>
      )}
      {isAuthenticated && account && (
        <Button
          primary
          className="w-full mt-4"
          onClick={() => navigate("/profile/authenticate")}
        >
          Profile
        </Button>
      )}
      {!isAuthenticated ? (
        <Button primary className="w-full mt-4" onClick={login}>
          Log in
        </Button>
      ) : (
        <p
          onClick={logout}
          className="block mt-4 text-sm font-light text-center cursor-pointer text-blue-base"
        >
          Logout
        </p>
      )}
    </div>
  )
}
