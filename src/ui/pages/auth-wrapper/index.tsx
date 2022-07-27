import React from "react"
import { generatePath, Navigate, useParams } from "react-router-dom"

import { AppScreenNFIDLogin } from "frontend/apps/authentication/authenticate/nfid-login"
import { useAuthentication } from "frontend/apps/authentication/use-authentication"
import { useAccount } from "frontend/integration/identity-manager/account/hooks"

interface AuthWrapperProps {
  redirectTo: string
  iframe?: boolean
  children?: React.ReactNode
}
export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  redirectTo,
}) => {
  const params = useParams()

  const { isAuthenticated } = useAuthentication()
  const { account } = useAccount()

  return isAuthenticated ? (
    <>{children}</>
  ) : account ? (
    <AppScreenNFIDLogin />
  ) : (
    <Navigate to={generatePath(redirectTo, params)} />
  )
}
