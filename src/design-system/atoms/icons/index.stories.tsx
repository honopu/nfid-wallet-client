import { Meta, Story } from "@storybook/react"
import React from "react"

import { DesktopIcon } from "@internet-identity-labs/nfid-sdk-react"

import { CalendarIcon } from "./calendar"
import { ButtonChevronIcon } from "./chevron"
import { CopyIcon } from "./copy"
import { IconLaptop } from "./desktop"
import { DocumentIcon } from "./document"
import { DotsIcon } from "./dots"
import { LogoutIcon } from "./logout"
import { MapPinIcon } from "./map-pin"
import { MobileIcon } from "./mobile"
import { PencilIcon } from "./pencil"
import { RefreshIcon } from "./refresh"
import { TabletIcon } from "./tablet"
import { TrashIcon } from "./trash"

const meta: Meta = {
  title: "Atoms/Icons",
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
}

export default meta

const Icons: Story = (args) => {
  return (
    <div>
      <div className="mb-2 font-bold">DeviceIcons:</div>
      <div className="flex items-center gap-2">
        <MobileIcon {...args} />
        <TabletIcon {...args} />
        <DesktopIcon {...args} />
        <IconLaptop {...args} />
        <DocumentIcon {...args} />
      </div>
      <div className="mt-4 mb-2 font-bold">Controls:</div>
      <div className="flex items-center gap-2">
        <PencilIcon {...args} />
        <TrashIcon {...args} />
        <ButtonChevronIcon {...args} />
        <CopyIcon {...args} />
        <DotsIcon {...args} />
        <LogoutIcon {...args} />
        <RefreshIcon {...args} />
      </div>
      <div className="mt-4 mb-2 font-bold">Other:</div>
      <div className="flex items-center gap-2">
        <CalendarIcon {...args} />
        <MapPinIcon {...args} />
      </div>
    </div>
  )
}

export const Overview = Icons.bind({})

Overview.args = {}
