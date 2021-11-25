import React from "react"
import TouchIdIcon from "./logo.png"

export const TemporarId: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ className = "w-10" }) => <img src={TouchIdIcon} className={className} />
