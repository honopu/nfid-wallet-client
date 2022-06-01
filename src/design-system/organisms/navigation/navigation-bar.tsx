import { ImageOnlyLoader } from "@internet-identity-labs/nfid-sdk-react"
import clsx from "clsx"
import React from "react"
import { Link } from "react-router-dom"

import { CONTAINER_CLASSES } from "frontend/design-system/atoms/container"
import { useScroll } from "frontend/hooks/use-scroll"

import { NavigationItems as NavigationItemsDefault } from "./navigation-items"

interface NavigationBarProps extends React.HTMLAttributes<HTMLDivElement> {
  navigationItems?: React.ReactNode
  isFocused?: boolean
  showLogo?: boolean
  profileScreen?: boolean
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  navigationItems,
  isFocused = false,
  showLogo,
  profileScreen = false,
}) => {
  const { scrollY } = useScroll()

  return (
    <header
      className={clsx(
        "flex-none sticky top-0 z-40 py-5",
        "sm:pb-9",
        profileScreen && "md:p-0 md:absolute",
        scrollY > 50 && "shadow-gray bg-white",
        scrollY < 50 && "opacity-100 bg-transparent",
      )}
    >
      <div className={clsx(CONTAINER_CLASSES)}>
        <div className="flex items-center justify-between">
          {showLogo && (
            <div className="flex items-center ">
              <Link
                to={"/"}
                className="flex items-center w-24 text-2xl font-black"
              >
                <span>NF</span>
                <ImageOnlyLoader className="w-12 h-12" />
              </Link>
            </div>
          )}

          {isFocused ? null : navigationItems ? (
            navigationItems
          ) : (
            <NavigationItemsDefault />
          )}
        </div>
      </div>
    </header>
  )
}
