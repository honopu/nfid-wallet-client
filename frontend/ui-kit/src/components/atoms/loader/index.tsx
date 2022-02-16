import clsx from "clsx"
import React from "react"
import loaderAsset from "./loader.webp"

interface LoaderProps {
  isLoading: boolean
  fullscreen?: boolean
  imageClasses?: string
}

export const Loader: React.FC<LoaderProps> = ({
  isLoading,
  fullscreen = true,
  imageClasses,
}) =>
  isLoading && fullscreen ? (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full">
      <div className="absolute w-full h-full top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-[75%]" />
      <img
        className={clsx(
          "absolute",
          "left-1/2 -translate-x-1/2",
          "top-1/2 -translate-y-1/2",
          "m-auto w-[125px] min-w-[125px] max-w-[calc(100vw-1rem)]",
        )}
        src={loaderAsset}
      />
    </div>
  ) : isLoading && !fullscreen ? (
    <img src={loaderAsset} className={clsx(imageClasses)} />
  ) : null
