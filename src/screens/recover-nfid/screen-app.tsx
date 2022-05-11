import clsx from "clsx"
import React from "react"

import { CONTAINER_CLASSES } from "frontend/design-system/atoms/container"
import { AppScreen } from "frontend/design-system/templates/AppScreen"
import { RecoverNFID } from "frontend/screens/recover-nfid"

interface RestoreAccessPointRecoveryPhraseProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  registerDeviceDeciderPath: string
  hasVerifiedDomain?: boolean
}

export const AppScreenRecoverNFID: React.FC<
  RestoreAccessPointRecoveryPhraseProps
> = ({ registerDeviceDeciderPath, hasVerifiedDomain }) => (
  <AppScreen isFocused showLogo>
    <main className={clsx("flex flex-1")}>
      <div className={clsx(CONTAINER_CLASSES)}>
        <div className="grid h-full grid-cols-12">
          <div className="flex flex-col col-span-12 md:col-span-11 lg:col-span-7">
            <RecoverNFID
              registerDevicePath={registerDeviceDeciderPath}
              hasVerifiedDomain={hasVerifiedDomain}
            />
          </div>
        </div>
      </div>
    </main>
  </AppScreen>
)
