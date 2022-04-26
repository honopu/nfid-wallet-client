import {
  Button,
  Card,
  CardBody,
  H5,
  Loader,
  P,
} from "@internet-identity-labs/nfid-sdk-react"
import clsx from "clsx"
import React from "react"
import { HiArrowLeft, HiArrowRight } from "react-icons/hi"
import { useNavigate, useParams } from "react-router-dom"
import { generatePath } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"

import { AppScreen } from "frontend/design-system/templates/AppScreen"
import { useIsLoading } from "frontend/hooks/use-is-loading"
import { useMultipass } from "frontend/hooks/use-multipass"

import { RemoteRegisterAccountConstants as RAC } from "./routes"

interface RegisterAccountIntroProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  captchaPath: string
}

export const RegisterAccountIntro: React.FC<RegisterAccountIntroProps> = ({
  captchaPath,
}) => {
  const { secret, scope } = useParams()

  const { isLoading, setIsloading } = useIsLoading()
  const navigate = useNavigate()
  const { applicationName, createWebAuthNIdentity } = useMultipass()
  const [lastSlide, setLastSlide] = React.useState(false)
  const [firstSlide, setFirstSlide] = React.useState(true)

  const appName = applicationName || "This application"

  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null)
  const [slide, setSlide] = React.useState<Number>()

  const gradientStyles = () => {
    switch (slide) {
      case 1:
        return {
          styles: {
            background: `linear-gradient(90deg,#0094FF,#A400CD)`,
          },
          bubbleBackground: ["#a69cff", "#4df1ffa8"],
        }
      case 2:
        return {
          styles: {
            background: `linear-gradient(90deg,#FF6B00,#D900B6)`,
          },
          bubbleBackground: ["#FFC83A95", "#FF1AF680"],
        }
      case 3:
        return {
          styles: {
            background: `linear-gradient(90deg,#00DE59,#005B83)`,
          },
          bubbleBackground: ["#ecfcae", "#a9fdd7"],
        }
      default:
        return {
          styles: {
            background: `linear-gradient(90deg,#0094FF,#A400CD)`,
          },
          bubbleBackground: ["#a69cff", "#4df1ffa8"],
        }
    }
  }

  const handleCreateKeys = React.useCallback(async () => {
    console.log(">> handleCreateKeys", {})
    setIsloading(true)
    const registerPayload = await createWebAuthNIdentity()
    console.log(">> ", { registerPayload, secret })

    // TODO: fix url
    const path = generatePath(captchaPath, {
      secret,
      scope,
    })
    console.log(">> ", { path })

    navigate(path, {
      state: {
        registerPayload,
      },
    })
    setIsloading(false)
  }, [
    captchaPath,
    createWebAuthNIdentity,
    navigate,
    scope,
    secret,
    setIsloading,
  ])

  return (
    <AppScreen
      isFocused
      bubbleOptions={{
        showBubbles: true,
        bubbleColors: [
          gradientStyles().bubbleBackground[0],
          gradientStyles().bubbleBackground[1],
        ],
        bubbleClassNames: [
          "right-[-40vw] md:right-[13vw] md:top-[16vh]",
          "bottom-[-10vh] md:right-[20vw] md:top-[30vh]",
        ],
      }}
    >
      <main className={clsx("flex flex-1")}>
        <div className="container px-6 py-0 mx-auto sm:py-4">
          <Card className="offset-header">
            <H5 className="mb-2 font-bold">{appName} uses NFID</H5>

            <CardBody>
              <Swiper
                autoHeight
                navigation={{
                  prevEl,
                  nextEl,
                }}
                onSlideChange={(swiper) => setSlide(swiper.activeIndex + 1)}
                pagination={{
                  el: ".swiper-pagination",
                  clickable: true,
                }}
                grabCursor={true}
                onRealIndexChange={(swiper) => {
                  setFirstSlide(swiper.realIndex === 0 ? true : false)
                  setLastSlide(
                    swiper.realIndex === swiper.slides.length - 1
                      ? true
                      : false,
                  )
                }}
              >
                <SwiperSlide>
                  <div className="max-w-2xl">
                    <div className="swiper-title">
                      <span
                        className="clip-text whitespace-nowrap "
                        style={gradientStyles().styles}
                      >
                        Privacy
                      </span>{" "}
                      with NFID
                    </div>
                    <P className="pb-4">
                      Every account you create across any service that supports
                      NFID will automatically create a new, untraceable hardware
                      wallet.
                    </P>

                    <P>
                      You are the only person in the world able to trace
                      accounts to your NFID, providing you with the best
                      possible privacy online.
                    </P>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="max-w-2xl">
                    <div className="swiper-title">
                      <span
                        className="clip-text whitespace-nowrap"
                        style={gradientStyles().styles}
                      >
                        Security
                      </span>{" "}
                      with NFID
                    </div>
                    <P className="pb-4">
                      Hardware wallets offer the greatest security guarantees
                      because their private keys can't be exported, making it a
                      one-way vault that only you have the ability to access.
                    </P>

                    <P>
                      NFID makes each of your internet accounts exactly this
                      kind of vault.
                    </P>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="max-w-xl">
                    <div className="swiper-title">
                      <span
                        className="clip-text whitespace-nowrap"
                        style={gradientStyles().styles}
                      >
                        Convenience
                      </span>{" "}
                      with NFID
                    </div>
                    <P className="pb-4">
                      A hardware device for each online account used to be
                      impractical. NFID stores private keys on the
                      specially-designed cryptographic chips of your phones,
                      tablets, and computers so that creating new accounts or
                      authenticating is simply a face or touch scan away.
                    </P>
                  </div>
                </SwiperSlide>
              </Swiper>

              <div className="swiper-controls">
                <div
                  ref={(node) => setPrevEl(node)}
                  className={clsx(
                    "swiper-button-prev",
                    !firstSlide && "cursor-pointer",
                  )}
                >
                  <HiArrowLeft
                    className={clsx(
                      "text-lg",
                      !firstSlide ? "text-black-base" : "text-gray-400",
                    )}
                  />
                </div>

                <div className="swiper-pagination"></div>

                <div
                  className={clsx(
                    "swiper-button-next",
                    !lastSlide && "cursor-pointer",
                  )}
                  ref={(node) => setNextEl(node)}
                >
                  <HiArrowRight
                    className={clsx(
                      "text-lg",
                      !lastSlide ? "text-black-base" : "text-gray-400",
                    )}
                  />
                </div>
              </div>

              <Button secondary onClick={handleCreateKeys} className="mt-8">
                Create new NFID
              </Button>

              <Loader isLoading={isLoading} />
            </CardBody>
          </Card>
        </div>
      </main>
    </AppScreen>
  )
}
