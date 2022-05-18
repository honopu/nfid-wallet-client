import React from "react"

import { IconLaptop } from "frontend/design-system/atoms/icons/desktop"
import { KeyIcon } from "frontend/design-system/atoms/icons/key"
import { IconDesktop } from "frontend/design-system/atoms/icons/laptop"
import { MobileIcon } from "frontend/design-system/atoms/icons/mobile"
import { TabletIcon } from "frontend/design-system/atoms/icons/tablet"
import { Icon } from "frontend/services/identity-manager/devices/state"

interface DeviceIconDeciderProps {
  icon: Icon
  onClick?: (e: React.SyntheticEvent) => void
}

export const DeviceIconDecider: React.FC<DeviceIconDeciderProps> = ({
  icon,
  onClick,
}) => {
  const props = {
    className: "text-xl text-blue-base",
    onClick,
  }
  console.log(">> ", { icon })

  switch (icon) {
    case "mobile":
      return <MobileIcon {...props} />
    case "tablet":
      return <TabletIcon {...props} />
    case "laptop":
      return <IconLaptop {...props} />
    case "desktop":
      return <IconDesktop {...props} />
    case "key":
      return <KeyIcon {...props} />
    default:
      return null
  }
}
