import clsx from "clsx"
import { format } from "date-fns"
import CopyAddress from "packages/ui/src/molecules/copy-address"
import { TickerAmount } from "packages/ui/src/molecules/ticker-amount"

import {
  IconCmpArrow,
  IconCmpStatusSuccess,
  IconCmpTinyIC,
  IconSvgArrowRight,
} from "@nfid-frontend/ui"

import { IActivityRow } from "frontend/features/activity/types"

interface IActivityTableRow extends IActivityRow {
  id: string
}

export const ChainIcons = {
  IC: <IconCmpTinyIC />,
}

export const StatusIcons = {
  Success: <IconCmpStatusSuccess />,
}

export const ActivityTableRow = ({
  action,
  asset,
  from,
  timestamp,
  to,
  id,
}: IActivityTableRow) => {
  return (
    <tr
      id={id}
      className="relative items-center text-sm activity-row hover:bg-gray-50"
    >
      <td className="flex items-center pl-5 sm:pl-[30px] w-[30%]">
        <div
          className={clsx(
            "w-10 h-10 rounded-[9px] flex items-center justify-center relative",
            action === "Sent" ? "bg-red-50" : "bg-emerald-50",
            "min-w-10",
          )}
        >
          <IconCmpArrow
            className={clsx(
              "text-gray-400",
              action === "Sent"
                ? "rotate-[135deg] text-red-600"
                : "rotate-[-45deg] !text-emerald-600",
            )}
          />
        </div>
        <div className="ml-2.5 mb-[11px] mt-[11px] shrink-0">
          <p className="font-semibold text-sm leading-[20px]">{action}</p>
          <p className="text-xs text-gray-400 leading-[20px]">
            {format(new Date(timestamp), "HH:mm:ss aaa")}
          </p>
        </div>
      </td>
      <td className="transition-opacity w-[20%] text-center pl-[28px]">
        <CopyAddress address={from} leadingChars={6} trailingChars={4} />
      </td>
      <td className="w-[24px] h-[24px] absolute left-0 right-0 top-0 bottom-0 m-auto">
        <img src={IconSvgArrowRight} alt="" />
      </td>
      <td className="transition-opacity w-[20%] text-center pl-[28px]">
        <CopyAddress address={to} leadingChars={6} trailingChars={4} />
      </td>
      {asset?.type === "ft" ? (
        <td className="leading-5 text-right sm:text-left pr-5 sm:pr-[30px] w-[30%]">
          <p className="text-sm">
            <TickerAmount
              value={asset.amount}
              decimals={asset.decimals}
              symbol={asset.currency}
            />
          </p>
          {asset.rate && (
            <p className="text-xs text-gray-400">
              <TickerAmount
                value={asset.amount}
                decimals={asset.decimals}
                symbol={asset.currency}
                usdRate={asset.rate}
              />
            </p>
          )}
        </td>
      ) : (
        <td className="leading-5 text-right sm:text-left">
          <div className="flex items-center">
            <img src={asset.preview} className="object-cover w-10 h-10" />
            <p className="ml-2.5 font-semibold">{asset.name}</p>
          </div>
        </td>
      )}
    </tr>
  )
}
