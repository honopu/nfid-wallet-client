import clsx from "clsx"
import React from "react"

interface SuccessProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Success: React.FC<SuccessProps> = ({ children, className }) => {
  return (
    <div className={clsx("", className)}>
      <svg
        width="53"
        height="37"
        viewBox="0 0 53 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.5403 37C18.2271 37 16.9139 36.5159 15.9114 35.542L1.99981 22.0269C-0.00514638 20.079 -0.00514638 16.9238 1.99981 14.9817C4.00477 13.0339 7.24671 13.0282 9.25167 14.976L19.5403 24.9714L43.7405 1.46086C45.7455 -0.486955 48.9874 -0.486955 50.9924 1.46086C52.9973 3.40868 52.9973 6.56392 50.9924 8.51174L23.1691 35.542C22.1667 36.5159 20.8535 37 19.5403 37Z"
          fill="#13D377"
        />
      </svg>
    </div>
  )
}
