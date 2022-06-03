import clsx from "clsx"
import React from "react"

import { RefreshIcon } from "frontend/design-system/atoms/icons/refresh"

import spinner from "./spinner.png"

interface ChallengeProps {
  src?: string
  refresh?: () => void
}

export const Challenge: React.FC<ChallengeProps> = ({ src, refresh }) => {
  return (
    <div
      className={clsx(
        "h-[150px] w-auto rounded-md my-4 flex",
        "bg-white border border-gray-200",
      )}
    >
      {!src ? (
        <div className="flex flex-col w-full h-full my-auto text-center animate-pulse center">
          <div className="h-5 m-auto">
            <img
              className="inline-block animate-spin"
              alt="spinner"
              src={spinner}
            />
            <span className="inline-block ml-2 text-xs font-normal align-middle opacity-40">
              Generating captcha, this might take a few seconds
            </span>
          </div>
        </div>
      ) : (
        <img alt="captcha" src={src} className="object-contain w-full h-full" />
      )}
      {refresh && (
        <div
          className={clsx(
            "flex items-center justify-center w-10 h-full bg-gray-200 rounded-r-md",
            "cursor-pointer",
          )}
          onClick={refresh}
        >
          <RefreshIcon />
        </div>
      )}
    </div>
  )
}
