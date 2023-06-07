import { chainService } from "packages/integration-ethereum/src/lib/decoder/chain-service"
import { useMemo } from "react"

import { IWarningAccordionOption } from "@nfid-frontend/ui"

import { ApproverCmpProps } from "frontend/features/embed/types"
import { calcPriceDeployCollection } from "frontend/features/embed/util/calcPriceDeployCollectionUtil"
import { useExchangeRates } from "frontend/features/fungable-token/eth/hooks/use-eth-exchange-rate"

import { SendTransaction } from "../ui/send-transaction"

const MappedDeployCollection: React.FC<ApproverCmpProps> = ({
  appMeta,
  rpcMessage,
  rpcMessageDecoded,
  populatedTransaction,
  disableConfirmButton,
  onConfirm,
  onReject,
}) => {
  const { rates } = useExchangeRates()
  const { symbol, currency, chainName } = chainService.getSymbolAndChainName(
    rpcMessage.options.chainId,
  )
  const rate = rates[currency]

  const price = useMemo(() => {
    return calcPriceDeployCollection(rate, populatedTransaction)
  }, [rate, populatedTransaction])

  const warnings = useMemo(() => {
    if (!price) return []
    let warnings: IWarningAccordionOption[] = []

    if (
      !rpcMessageDecoded?.data?.meta?.content[0].url &&
      !rpcMessageDecoded?.data?.meta?.name &&
      rpcMessageDecoded?.data?.collectionData?.name
    )
      warnings.push({
        title: "Preview unavailable",
        subtitle:
          "Unable to estimate asset changes. Please make sure you trust this dapp.",
      })

    if (price.isNetworkIsBusyWarning)
      warnings.push({
        title: "Network is busy",
        subtitle: (
          <>
            Gas prices are high and estimates are less accurate.
            <span className="text-blue-600"> Adjust the network fee.</span>
          </>
        ),
      })

    return warnings
  }, [
    price,
    rpcMessageDecoded?.data?.collectionData?.name,
    rpcMessageDecoded?.data?.meta?.content,
    rpcMessageDecoded?.data?.meta?.name,
  ])
  return (
    <SendTransaction
      title="Deploy collection"
      applicationMeta={appMeta}
      fromAddress={rpcMessage?.params[0].from}
      toAddress={rpcMessage?.params[0].to}
      networkFee={price.fee}
      totalUSD={price.feeUsd}
      totalToken={price.fee}
      network={chainName}
      currency={symbol}
      onApprove={onConfirm}
      disableApproveButton={disableConfirmButton}
      isInsufficientBalance={!!price.isInsufficientFundsError}
      warnings={warnings}
      onCancel={onReject}
    />
  )
}

export default MappedDeployCollection
