import { format } from "date-fns"
import { useMemo } from "react"
import React from "react"
import { useSearchParams } from "react-router-dom"

import { useTransactionsFilter } from "frontend/integration/wallet/hooks/use-transactions-filter"
import { useWallet } from "frontend/integration/wallet/hooks/use-wallet"
import { IOption } from "frontend/ui/atoms/dropdown-select"
import { Loader } from "frontend/ui/atoms/loader"
import ProfileTransactionsPage from "frontend/ui/pages/new-profile/transaction-history"

interface ITransaction {
  type: "send" | "receive"
  date: string
  asset: string
  quantity: number
  from: string
  to: string
  note?: string
}

const ProfileTransactions = () => {
  const { walletTransactions, walletAddress, isWalletLoading } = useWallet()

  const [search] = useSearchParams()

  const transactionFilterFromSearch = search.get("wallet")

  const [transactionFilter, setTransactionFilter] = React.useState<string[]>(
    transactionFilterFromSearch ? [transactionFilterFromSearch] : [],
  )
  const { transactionsFilterOptions } = useTransactionsFilter({
    excludeEmpty: true,
    includeAddresses: transactionFilterFromSearch
      ? [transactionFilterFromSearch]
      : [],
  })

  const selectedTransactionFilter = React.useMemo(
    () =>
      transactionFilter
        .map((f) => transactionsFilterOptions.find((tf) => tf.value === f))
        .filter((f: IOption | undefined): f is IOption => Boolean(f)),
    [transactionFilter, transactionsFilterOptions],
  )

  // TODO: move out of React
  const transactions: ITransaction[] | undefined = useMemo(() => {
    return walletTransactions?.transactions
      .map<ITransaction>(({ transaction }) => {
        const isSend =
          transaction.operations[0].account.address === walletAddress

        return {
          type: isSend ? "send" : "receive",
          asset: transaction.operations[0].amount.currency.symbol,
          quantity: Math.abs(Number(transaction.operations[0].amount.value)),
          date: format(
            new Date(transaction.metadata.timestamp / 1000000),
            "MMM dd, yyyy - hh:mm:ss aaa",
          ),
          from: transaction.operations[0].account.address,
          to: transaction.operations[1].account.address,
        }
      })
      .filter(({ from, to }) => {
        if (selectedTransactionFilter.length === 0) return true
        const addresses = selectedTransactionFilter.map((stf) => stf.value)
        return addresses.findIndex((address) => address === (from || to)) > -1
      })
  }, [
    selectedTransactionFilter,
    walletAddress,
    walletTransactions?.transactions,
  ])

  const handleRemoveFilterChip = React.useCallback(
    (value: string) => {
      const transactionFilter = selectedTransactionFilter.filter(
        (stf) => stf.label !== value,
      )
      setTransactionFilter(transactionFilter.map((tf) => tf.value))
    },
    [selectedTransactionFilter],
  )

  return (
    <>
      <Loader isLoading={isWalletLoading && !transactions?.length} />
      <ProfileTransactionsPage
        sentData={transactions?.filter((t) => t.type === "send") ?? []}
        receivedData={transactions?.filter((t) => t.type === "receive") ?? []}
        transactionsFilterOptions={transactionsFilterOptions}
        setTransactionFilter={setTransactionFilter}
        selectedTransactionFilter={transactionFilter}
        chips={selectedTransactionFilter.map((f) => f.label)}
        onChipRemove={handleRemoveFilterChip}
      />
    </>
  )
}

export default ProfileTransactions
