import { Button, ButtonMenu } from "@internet-identity-labs/nfid-sdk-react"
import clsx from "clsx"
import React from "react"
import { Link, useNavigate } from "react-router-dom"

import User from "frontend/assets/user.svg"
import { useRegisterQRCode } from "frontend/flows/screens-app/landing-page/register-qrcode/use-register-qrcode"
import { RestoreAccessPointConstants as RAC } from "frontend/flows/screens-app/restore-access-point/routes"
import { useAuthentication } from "frontend/hooks/use-authentication"
import useClickOutside from "frontend/hooks/use-click-outside"
import { useAccount } from "frontend/services/identity-manager/account/hooks"

import IconMenu from "../../../flows/screens-app/landing-page/assets/menu_close.svg"
import { NavigationPopup } from "./navigation-popup"
import { PopupLogin } from "./navigation-popup/popup-login"

interface NavigationItemsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationItems: React.FC<NavigationItemsProps> = () => {
  const { isAuthenticated } = useAuthentication()
  const { account } = useAccount()
  const navigate = useNavigate()
  const [isPopupVisible, setIsPopupVisible] = React.useState(false)
  const popupRef = useClickOutside(() => setIsPopupVisible(false))
  const { registerRoute, status } = useRegisterQRCode()

  const classes = {
    navItem:
      "text-black hover:underline cursor-pointer hover:text-blue-hover transition-all",
  }

  const items = [
    {
      label: "The Identity Layer",
      to: "home",
      external: false,
    },
    {
      label: "Only with NFID",
      to: "only-with-nfid",
      external: false,
    },
    {
      label: "Our mission",
      to: "our-mission",
      external: false,
    },
    // {
    //   label: "Partners",
    //   to: "partners",
    // },
    {
      label: "FAQ",
      to: "faq",
      external: false,
    },
    {
      label: "Docs",
      to: "https://docs.nfid.one",
      external: true,
    },
  ]

  const handleGoTo = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    item: string,
    external: boolean,
  ) => {
    e.preventDefault()
    if (external) window.open(item)
    if (window.location.pathname !== "/") navigate(`/#${item}`)

    const element = document.getElementById(item)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <>
      <div className="md:hidden">
        <ButtonMenu
          buttonElement={
            <img src={IconMenu} alt="menu" className="rotate-180" />
          }
        >
          {(toggleMenu) => (
            <div className="p-4 py-6 space-y-5 font-bold bg-white rounded w-[70vw] pt-28">
              {items.map((item, index) => (
                <a
                  href={`/#${encodeURIComponent(item.label)}`}
                  className={classes.navItem}
                  onClick={(el) => {
                    el.stopPropagation()
                    handleGoTo(el, item.to, item.external)
                    toggleMenu()
                  }}
                  key={index}
                >
                  {item.label}
                </a>
              ))}
              {isAuthenticated || account ? (
                <PopupLogin />
              ) : (
                <>
                  <Button
                    className={"leading-none"}
                    largeMax
                    primary
                    onClick={() => navigate(registerRoute)}
                  >
                    Register your NFID
                  </Button>
                  {/*<Link*/}
                  {/*  className="block mt-4 text-sm font-light text-center cursor-pointer text-blue-base"*/}
                  {/*  to={`${RAC.base}/${RAC.recoveryPhrase}`}*/}
                  {/*  state={{ from: "loginWithRecovery" }}*/}
                  {/*>*/}
                  {/*  Unlock NFID with Security Key*/}
                  {/*</Link>*/}
                  <Link
                    className="block mt-4 text-sm font-light text-center cursor-pointer text-blue-base"
                    to={`${RAC.base}/${RAC.recoveryPhrase}`}
                    state={{ from: "loginWithRecovery" }}
                  >
                    Recover your NFID
                  </Link>
                </>
              )}
            </div>
          )}
        </ButtonMenu>
      </div>

      <div className="items-center hidden space-x-10 md:flex">
        {items.map((item, index) => (
          <a
            href={`/#${encodeURIComponent(item.label)}`}
            className={classes.navItem}
            onClick={(e) => handleGoTo(e, item.to, item.external)}
            key={index}
          >
            {item.label}
          </a>
        ))}
        <div className="relative" ref={popupRef}>
          {isAuthenticated || account ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-base">
              <img
                src={User}
                alt="user"
                className="cursor-pointer"
                onClick={() => setIsPopupVisible(!isPopupVisible)}
              />
            </div>
          ) : (
            <Button
              className={clsx(
                "h-full leading-none",
                window.scrollY < 500 && "hidden",
              )}
              primary
              onClick={() => setIsPopupVisible(!isPopupVisible)}
            >
              Register your NFID
            </Button>
          )}
          {isPopupVisible || status === "registerDecider" || status === 'registerDevice' ? (
            <div>
              <NavigationPopup
                className={clsx(
                  window.scrollY < 500 && status === "" ? "hidden" : null,
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
