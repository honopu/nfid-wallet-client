import clsx from "clsx"
import { Button } from "components/atoms/button"
import { Loader } from "components/atoms/loader"
import { H2, H5 } from "components/atoms/typography"
import { useUnknownDeviceConfig } from "frontend/flows/screens-iframe/authenticate/login-unknown/hooks/use-unknown-device.config"
import { IFrameUnknownDeviceConstants } from "frontend/flows/screens-iframe/authenticate/login-unknown/routes"
import { useAuthentication } from "frontend/hooks/use-authentication"
import { parseUserNumber } from "frontend/services/internet-identity/userNumber"
import { TextArea } from "frontend/ui-kit/src"
import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { UnknownDeviceConstants } from "../../authenticate/login-unknown/register-decider/routes"

interface RestoreAccessPointRecoveryPhraseContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  iframe?: boolean
}

export const RestoreAccessPointRecoveryPhraseContent: React.FC<
  RestoreAccessPointRecoveryPhraseContentProps
> = ({ children, className, iframe }) => {
  const { loginWithRecovery, error, isLoading } = useAuthentication()
  const navigate = useNavigate()
  const { setShowRegister } = useUnknownDeviceConfig()
  const {
    register,
    formState: { errors, isValid },
    setError,
    handleSubmit,
  } = useForm({
    mode: "all",
  })

  const onLogin = React.useCallback(
    async (data: any) => {
      try {
        const { recoveryPhrase } = data

        const stringUserNumber = recoveryPhrase.split(" ")[0]
        const userNumber = parseUserNumber(stringUserNumber)

        if (!userNumber) {
          throw new Error("Invalid anchor")
        }

        const result = await loginWithRecovery(
          recoveryPhrase.split(`${userNumber} `)[1],
          userNumber,
        )

        if (result?.tag === "ok") {
          setShowRegister(true)

          navigate(
            iframe
              ? `${IFrameUnknownDeviceConstants.base}`
              : `${UnknownDeviceConstants.base}`,
            {
              state: {
                userNumber,
                from: "loginWithRecovery",
              },
            },
          )
        } else {
          console.log("result :>> ", result)

          setError("recoveryPhrase", {
            type: "manual",
            message: "Invalid Recovery Phrase",
          })
        }
      } catch (error) {
        setError("recoveryPhrase", {
          type: "manual",
          message: "Invalid Recovery Phrase (missing Anchor)",
        })
      }
    },
    [iframe, loginWithRecovery, navigate, setError, setShowRegister],
  )

  const title = "Log in with Recovery Phrase"

  React.useEffect(() => {
    if (error) {
      setError("recoveryPhrase", {
        type: "manual",
        message: "Invalid Recovery Phrase",
      })
    }
  }, [error, setError])

  return (
    <div className={clsx("", className)}>
      <div>
        {iframe ? (
          <H5 className="mb-4">{title}</H5>
        ) : (
          <H2 className="mb-4">{title}</H2>
        )}

        <div className={clsx(iframe ? "mb-2" : "mb-6")}>
          Paste your recovery phrase here to proceed:
        </div>

        <TextArea
          rows={6}
          errorText={errors.recoveryPhrase?.message}
          {...register("recoveryPhrase", {
            required: {
              value: true,
              message: "Please enter your Recovery Phrase",
            },
          })}
        />

        <Button
          secondary
          block={iframe}
          large={!iframe}
          className="my-4"
          onClick={handleSubmit(onLogin)}
        >
          Log in
        </Button>

        <Loader isLoading={isLoading} iframe={iframe} />
      </div>
    </div>
  )
}
