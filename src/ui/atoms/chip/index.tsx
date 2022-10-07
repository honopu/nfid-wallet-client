import clsx from "clsx"
import React from "react"

import iconClose from "./close.svg"

export interface IChip {
  onRemove?: () => void
  title?: string
}

export const Chip: React.FC<IChip> = ({ onRemove, title }) => {
  if (!title?.length) return null
  return (
    <div
      className={clsx(
        "flex items-center py-1 pl-2 pr-1 space-x-1",
        "border border-black-base rounded-full",
        "w-max",
      )}
    >
      <span className="text-xs tracking-[0.16px]">{title}</span>
      <img
        onClick={onRemove}
        className={clsx(
          "block w-4 cursor-pointer",
          "hover:opacity-40 transition-opacity",
        )}
        src={iconClose}
        alt=""
      />
    </div>
  )
}
