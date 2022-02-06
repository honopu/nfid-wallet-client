import clsx from "clsx"
import { Button } from "components/atoms/button"
import { H5 } from "components/atoms/typography"
import React from "react"
import { ModalCloseIcon } from "../closeIcon"

export interface ModalButtonProps {
  text: string
  onClick: () => void
  type?: "primary" | "secondary" | "error"
}

export interface ModalAdvancedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title: string
  onClose?: () => void
  primaryButton?: ModalButtonProps
  secondaryButton?: ModalButtonProps
}

export const ModalAdvanced: React.FC<ModalAdvancedProps> = ({
  children,
  className,
  title,
  onClose,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none mx-4">
        <div className="relative w-full my-6 mx-auto max-w-sm md:max-w-lg">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto  px-6">
              <H5 className="my-4">{title}</H5>

              <div className={clsx("", className)}>{children}</div>
            </div>

            <div className="flex items-center justify-end p-6 space-x-4">
              {secondaryButton && (
                <Button
                  stroke
                  className={clsx("!py-3 !px-8")}
                  onClick={secondaryButton?.onClick}
                  largeMax
                >
                  {secondaryButton?.text}
                </Button>
              )}

              {primaryButton && (
                <Button
                  primary={primaryButton.type === "primary"}
                  secondary={primaryButton.type === "secondary"}
                  error={primaryButton.type === "error"}
                  className={clsx("!py-3 !px-8")}
                  onClick={primaryButton.onClick}
                  largeMax
                >
                  {primaryButton.text}
                </Button>
              )}
            </div>
          </div>

          <div className="absolute top-5 right-5" onClick={onClose}>
            <ModalCloseIcon />
          </div>
        </div>
      </div>
      <div className="opacity-5 fixed inset-0 z-40 bg-black-base"></div>
    </>
  )
}
