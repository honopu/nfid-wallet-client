import { ComponentStory } from "@storybook/react"
import { ToastContainer } from "react-toastify"

import { ToastIcons } from "frontend/ui/atoms/toast-icons"

import { AppAccountBalanceSheet } from "."

export default {
  title: "Organisms/AppAccountBalanceSheet",
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
}

const Template: ComponentStory<typeof AppAccountBalanceSheet> = (args) => (
  <div>
    <ToastContainer icon={({ type }) => ToastIcons[type]} />
    <AppAccountBalanceSheet />
  </div>
)

export const Default = Template.bind({})
Default.args = {}
