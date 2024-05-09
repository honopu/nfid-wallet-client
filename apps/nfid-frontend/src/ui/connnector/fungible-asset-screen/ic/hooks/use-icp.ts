import { Ed25519KeyIdentity } from "@dfinity/identity"
import { Chain, getPublicKey } from "packages/integration/src/lib/lambda/ecdsa"
import { useAllDip20Token } from "src/features/fungable-token/dip-20/hooks/use-all-token-meta"
import { useBalanceICPAll } from "src/features/fungable-token/icp/hooks/use-balance-icp-all"
import { stringICPtoE8s } from "src/integration/wallet/utils"
import { AssetFilter, Blockchain, TokenConfig } from "src/ui/connnector/types"

import { IconSvgDfinity } from "@nfid-frontend/ui"
import { authState } from "@nfid/integration"
import { toPresentation, WALLET_FEE_E8S } from "@nfid/integration/token/icp"
import { TokenStandards } from "@nfid/integration/token/types"
import { useAllICRC1Token } from "frontend/features/fungable-token/icrc1"

export const useICTokens = (
  assetFilter: AssetFilter[],
): { configs: TokenConfig[]; isLoading: boolean } => {
  const { appAccountBalance, isLoading } = useBalanceICPAll(true, assetFilter)
  const { token: dip20Token } = useAllDip20Token()
  const { token: ICRC1Token } = useAllICRC1Token()

  console.log('dip20Token', dip20Token);
  console.log('ICRC1Token', ICRC1Token);

  return {
    configs: [
      {
        icon: IconSvgDfinity,
        tokenStandard: TokenStandards.ICP,
        title: "Internet Computer",
        currency: "ICP",
        balance: appAccountBalance?.ICP.tokenBalance,
        price: appAccountBalance?.ICP.usdBalance,
        fee: BigInt(WALLET_FEE_E8S),
        toPresentation,
        transformAmount: stringICPtoE8s,
        blockchain: Blockchain.IC,
      },
      ...(dip20Token
        ? dip20Token.map(({ symbol, name, logo, ...rest }) => ({
            tokenStandard: TokenStandards.DIP20,
            icon: logo,
            title: name,
            currency: symbol,
            balance: appAccountBalance?.[symbol].tokenBalance,
            price: appAccountBalance?.[symbol].usdBalance,
            blockchain: Blockchain.IC,
            ...rest,
          }))
        : []
      ).filter((token) => token.balance > 0),
      ...(ICRC1Token
        ? ICRC1Token.map(({ symbol, name, logo, ...rest }) => ({
            tokenStandard: TokenStandards.ICRC1,
            icon: logo,
            title: name,
            currency: symbol,
            blockchain: Blockchain.IC,
            ...rest,
          }))
        : []
      ),
    ],
    isLoading,
  }
}

export const getICPublicDelegation = async () => {
  const { delegationIdentity } = authState.get()

  const publicKey = await getPublicKey(delegationIdentity!, Chain.IC)
  const publicDelegation = Ed25519KeyIdentity.fromParsedJson([publicKey, "0"])

  return publicDelegation
}
