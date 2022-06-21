import clsx from "clsx"
import React from "react"
import { useForm } from "react-hook-form"

import { P } from "@internet-identity-labs/nfid-sdk-react"

import { isValidToken, tokenRules } from "frontend/utils/validations"

import { Button } from "../button"
import { Input } from "../input"

interface StepInputProps {
  className?: string
  errorClasses?: string
  onSubmit: (value: string) => boolean
  onChangePhoneNumber?: () => void
}

export const StepInput: React.FC<StepInputProps> = ({
  className,
  onSubmit,
  errorClasses,
  onChangePhoneNumber,
}) => {
  const list = [...Array(6).keys()]
  const inputItemsRef = React.useRef<Array<HTMLInputElement | null>>([])
  const {
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm({
    mode: "all",
  })

  const getVerificationCode = React.useCallback(
    () => inputItemsRef.current.map((item) => item?.value).join(""),
    [],
  )

  const handleKeydown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      const currentFocus = document.activeElement
      const index = Number(currentFocus?.getAttribute("data-pin-index"))

      if (index && !inputItemsRef.current[index]?.value) {
        inputItemsRef.current[index - 1]?.focus()
      }
    }
  }, [])

  const handlePaste = React.useCallback(
    (event: ClipboardEvent) => {
      const paste = event.clipboardData?.getData("text/plain")

      if (paste && isValidToken(paste)) {
        inputItemsRef.current.forEach((item, index) => {
          if (item) {
            item.value = paste[index]
            inputItemsRef.current[index]?.blur()
          }
        })

        clearErrors("verificationCode")
      }
    },
    [clearErrors],
  )

  const handleInput = (e: { target: HTMLInputElement }, index: number) => {
    const validRegex = inputItemsRef.current[index]?.value.match(
      e.target.pattern,
    )

    if (validRegex) {
      if (index === list.length - 1) {
        inputItemsRef.current[index]?.blur()
      }

      inputItemsRef.current[index + 1]?.focus()
    } else {
      e.target.value = e.target.value[0]
    }
  }

  React.useEffect(() => {
    document.addEventListener("paste", handlePaste)
    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("paste", handlePaste)
    }
  }, [handleKeydown, handlePaste])

  const validateToken = () => {
    const verificationCode = getVerificationCode()

    if (verificationCode.length !== tokenRules.minLength) {
      return setError("verificationCode", {
        type: "manual",
        message: tokenRules.errorMessages.length,
      })
    }

    if (!isValidToken(verificationCode)) {
      return setError("verificationCode", {
        type: "manual",
        message: tokenRules.errorMessages.pattern,
      })
    }

    clearErrors("verificationCode")
  }

  const handleSubmit = () => {
    if (!isValid) return
    if (!onSubmit(getVerificationCode())) {
      setError("verificationCode", {
        type: "manual",
        message: "Incorrect verification code, please try again.",
      })
    }
  }

  return (
    <div>
      <div className={clsx("flex space-x-3", className)}>
        {list.map((_, index) => (
          <Input
            pin
            type="number"
            key={index}
            autoFocus={index === 0}
            data-pin-index={index}
            ref={(el) => (inputItemsRef.current[index] = el)}
            onChange={(e) => handleInput(e, index)}
            maxLength={1}
            pattern="^[0-9]{1}$"
            isErrorStyles={!isValid}
          />
        ))}
      </div>
      <div className={clsx("py-1 text-sm text-red-base", errorClasses)}>
        {errors.verificationCode?.message || errors.phonenumber?.message}
      </div>
      <Button
        primary
        block
        className="px-10 mt-3 sm:mt-5"
        onClick={() => {
          validateToken()
          handleSubmit()
        }}
      >
        Complete
      </Button>
      <P
        onClick={onChangePhoneNumber}
        className="mt-4 mb-8 text-sm text-center text-blue-base"
      >
        Change phone number
      </P>
    </div>
  )
}
