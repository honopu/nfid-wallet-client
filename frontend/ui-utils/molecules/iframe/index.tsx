import React, { useState } from "react"
import clsx from "clsx"
import { Card } from "../card"
import { HiX } from "react-icons/hi"
import { Spinner } from "frontend/ui-utils/atoms/loader/spinner"

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title?: string
  src: string
  inline?: boolean
}

export const IFrame: React.FC<Props> = ({
  children,
  className,
  title,
  src,
  inline = false,
}) => {
  const [visible, setVisible] = useState(true)
  const [height, setHeight] = useState(200)
  const [loading, setLoading] = useState(true)

  const handleLoad = (iframe: any) => {
    if (iframe) {
      const topBarHeight = 57
      const iframeHeight =
        iframe.target.contentWindow.document.body.offsetHeight

      setHeight(topBarHeight + iframeHeight + 46)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    setLoading(true)

    const timeout = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  return visible ? (
    <Card
      className={clsx(
        "bg-white shadow-xl max-w-screen md:max-w-xl rounded-xl w-full md:w-[390px] transition-all duration-300",
        className,
        !inline && "fixed bottom-0 right-0  md:top-[18px] md:right-7",
      )}
      style={{ height: height }}
    >
      <div className="w-full  text-black overflow-hidden rounded-t-xl border-b border-gray-200 bg-white">
        <div
          className={clsx(
            title ? "justify-between" : "flex-row-reverse",
            "flex items-center h-full w-full p-4",
          )}
        >
          {title && (
            <div className="first-letter:capitalize font-medium">{title}</div>
          )}

          <HiX
            className="rounded-xl cursor-pointer text-2xl text-gray-400 hover:text-gray-500"
            onClick={() => setVisible(false)}
          />
        </div>
      </div>

      {loading && (
        <div className="h-[calc(100%-57px)] flex justify-center items-center">
          <Spinner />
        </div>
      )}

      <iframe
        className={clsx(
          "w-full transition-all delay-300 px-6 py-4 h-full",
          loading && "opacity-0",
        )}
        src={src}
        frameBorder="0"
        title={title}
        onLoad={(iframe) => handleLoad(iframe)}
      >
        {children}
      </iframe>
    </Card>
  ) : null
}
