import clsx from "clsx"
import { Button } from "components/atoms/button"
import { Loader } from "components/atoms/loader"
import { H2, H5 } from "components/atoms/typography"
import { useUnknownDeviceConfig } from "frontend/flows/screens-iframe/authenticate/login-unknown/hooks/use-unknown-device.config"
import { useAuthentication } from "frontend/hooks/use-authentication"
import { parseUserNumber } from "frontend/services/internet-identity/userNumber"
import { TextArea } from "frontend/ui-kit/src"
import React from "react"
import { useForm } from "react-hook-form"
import { useAccount } from "frontend/services/identity-manager/account/hooks"
import { useMessageChannel } from "frontend/flows/screens-iframe/authenticate/login-unknown/hooks/use-message-channel"

interface RestoreAccessPointRecoveryPhraseContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  iframe?: boolean
}

export const RestoreAccessPoint: React.FC<
  RestoreAccessPointRecoveryPhraseContentProps
> = ({ children, className, iframe }) => {
  const { loginWithRecovery, error, isLoading, isAuthenticated } =
    useAuthentication()
  const { setLocalAccount } = useAccount()
  const { handleStoreNewDevice, setUserNumber, handleRegisterDevice } =
    useUnknownDeviceConfig()

  const handleNewDevice = React.useCallback(
    async (event) => {
      console.log(">> ", { event })
      const response = await handleStoreNewDevice(event.data)
      console.log(">> ", { response })
    },
    [handleStoreNewDevice],
  )

  useMessageChannel({
    messageHandler: {
      "new-device": handleNewDevice,
    },
  })

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
          setUserNumber(userNumber)
          setLocalAccount({ anchor: userNumber.toString() })
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
    [loginWithRecovery, setError, setLocalAccount, setUserNumber],
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

  return isAuthenticated ? (
    <div>
      <Button secondary onClick={handleRegisterDevice}>
        Register Device
      </Button>
    </div>
  ) : (
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
