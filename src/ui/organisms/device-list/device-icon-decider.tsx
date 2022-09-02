import React from "react"

import { Icon } from "frontend/integration/identity-manager/devices/state"
import { IconLaptop } from "frontend/ui/atoms/icons/desktop"
import { DocumentIcon } from "frontend/ui/atoms/icons/document"
import { GoogleIcon } from "frontend/ui/atoms/icons/google"
import { IconDesktop } from "frontend/ui/atoms/icons/laptop"
import { MobileIcon } from "frontend/ui/atoms/icons/mobile"
import { TabletIcon } from "frontend/ui/atoms/icons/tablet"
import { UnknownIcon } from "frontend/ui/atoms/icons/unknown"
import { USBIcon } from "frontend/ui/atoms/icons/usb"

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

  switch (icon) {
    case "mobile":
      return <MobileIcon {...props} />
    case "tablet":
      return <TabletIcon {...props} />
    case "laptop":
      return <IconLaptop {...props} />
    case "desktop":
      return <IconDesktop {...props} />
    case "document":
      return <DocumentIcon {...props} />
    case "usb":
      return <USBIcon {...props} />
    case "google":
      return <GoogleIcon {...props} />
    case "unknown":
      return <UnknownIcon {...props} />
    default:
      return null
  }
}
