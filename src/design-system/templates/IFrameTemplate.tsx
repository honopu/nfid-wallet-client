import { Loader, Logo } from "@internet-identity-labs/nfid-sdk-react"
import clsx from "clsx"
import React, { useEffect } from "react"

import logo from "./assets/id.svg"

import { NFIDGradientBar } from "../atoms/gradient-bar"

interface IFrameTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  loadingMessage?: string
}

export const IFrameTemplate: React.FC<IFrameTemplateProps> = ({
  children,
  className,
  isLoading,
  loadingMessage,
}) => {
  return (
    <div
      className={clsx(
        "relative flex flex-col justify-between h-screen font-inter",
        "sm:min-h-[550px] sm:w-[450px] sm:absolute sm:h-auto",
        "sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2",
      )}
    >
      <NFIDGradientBar className="w-full h-0.5" rounded={false} />

      <div
        className={clsx(
          "border-b border-gray-100 mt-1 py-3 px-5 space-x-2 flex cursor-pointer hover:opacity-75 transition-opacity",
          "sm:border-x",
        )}
      >
        <img src={logo} alt="logo" />
        <span className="text-xs text-gray-400">Sign in with NFID</span>
      </div>

      <div
        className={clsx(
          "flex-1 px-5 pt-7",
          "sm:border-x sm:border-b sm:border-gray-100",
          className,
        )}
      >
        {children}
      </div>

      <div
        className={clsx(
          "px-5 mb-5 text-xs text-gray-400",
          "sm:mt-4 sm:text-center",
        )}
      >
        NFID is a privacy-preserving, one-touch multi-factor wallet protocol
        developed by Internet Identity Labs.
      </div>

      {isLoading && (
        <div className="absolute top-0 bottom-0 w-full">
          <div className="absolute top-0 left-0 z-10 w-full h-full bg-white bg-opacity-70 backdrop-blur-sm" />
          <div className="z-20 flex flex-col items-center justify-center w-full h-full px-14">
            <Loader
              iframe
              isLoading={isLoading}
              fullscreen={false}
              imageClasses={"w-[90px] mx-auto py-6 -mt-4 z-20"}
            />
            {loadingMessage && (
              <div className="z-20 mt-5 text-center">{loadingMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
