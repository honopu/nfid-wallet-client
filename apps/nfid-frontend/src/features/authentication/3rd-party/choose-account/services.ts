import { principalToAddress } from "ictool"
import { Chain, getGlobalKeys, getPublicKey } from "packages/integration/src/lib/lambda/ecdsa"

import { truncateString } from "@nfid-frontend/utils"
import { authState, getBalance } from "@nfid/integration"

import { toUSD } from "frontend/features/fungable-token/accumulate-app-account-balances"
import { getExchangeRate } from "frontend/integration/rosetta/get-exchange-rate"
import { e8sICPToString } from "frontend/integration/wallet/utils"
import { Ed25519KeyIdentity } from "@dfinity/identity"

export const getPublicProfile = async (): Promise<{
  address: string
  balance: string
  balanceUSD: string
}> => {
  const { delegationIdentity } = authState.get()
  if (!delegationIdentity) throw new Error("No identity")

  const publicKey = await getPublicKey(delegationIdentity!, Chain.IC)
  const publicDelegation = Ed25519KeyIdentity.fromParsedJson([publicKey, ""])

  const principal = publicDelegation.getPrincipal()
  const address = principalToAddress(principal)
  const balance = e8sICPToString(Number(await getBalance(address)))
  const exchangeRate = await getExchangeRate()

  return {
    address: truncateString(principal.toText(), 6, 4),
    balance: balance,
    balanceUSD: toUSD(Number(balance), exchangeRate),
  }
}
