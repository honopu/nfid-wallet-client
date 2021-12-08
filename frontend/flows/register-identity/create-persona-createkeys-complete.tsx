import React, { useEffect, useState } from "react"
import clsx from "clsx"
import { Card } from "frontend/design-system/molecules/card"
import { CardTitle } from "frontend/design-system/molecules/card/title"
import { Link, useLocation } from "react-router-dom"
import { CardAction } from "frontend/design-system/molecules/card/action"
import { Button } from "frontend/design-system/atoms/button"
import { AppScreen } from "frontend/design-system/templates/AppScreen"
import { CardBody } from "frontend/design-system/molecules/card/body"
import { P } from "frontend/design-system/atoms/typography/paragraph"
import { HiCheck, HiClipboard } from "react-icons/hi"
import { useAuthContext } from "../auth-wrapper"

interface IdentityPersonaCreatekeysCompleteScreenProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const IdentityPersonaCreatekeysCompleteScreen: React.FC<IdentityPersonaCreatekeysCompleteScreenProps> =
  ({ className }) => {
    const {
      state: { recoveryPhrase },
    } = useLocation()

    const { startUrl } = useAuthContext()

    const [copied, setCopied] = useState(false)
    return (
      <AppScreen isFocused>
        <Card className={clsx("h-full flex flex-col sm:block", className)}>
          <CardTitle>Welcome! You're all set</CardTitle>
          <CardBody className="flex flex-col items-center max-w-lg">
            <div className="bg-gray-200 rounded p-4">
              <div className="uppercase font-bold text-center mb-5 text-indigo-600">
                You need to save this!
              </div>
              <P>{recoveryPhrase}</P>

              <Button
                className={clsx(
                  "flex items-center float-right my-2",
                  copied
                    ? "border-indigo-700 text-indigo-700"
                    : "border-indigo-500 text-indigo-500",
                )}
                onClick={() => setCopied(true)}
              >
                {copied ? (
                  <HiCheck className="text-lg mr-2" />
                ) : (
                  <HiClipboard className="text-lg mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardBody>
          <CardAction bottom className="justify-center">
            {copied ? (
              <Link to={startUrl}>
                <Button block large filled>
                  Log in to DSCVR
                </Button>
              </Link>
            ) : (
              <Button block large filled disabled>
                Log in to DSCVR
              </Button>
            )}
          </CardAction>
        </Card>
      </AppScreen>
    )
  }
