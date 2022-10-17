import clsx from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"
import { IoIosSearch } from "react-icons/io"

import useClickOutside from "frontend/ui/utils/use-click-outside"

import { Checkbox } from "../checkbox"
import { Input } from "../input"
import Arrow from "./arrow.svg"

export interface IOption {
  label: string
  afterLabel?: string | number
  icon?: string
  value: string
}

export interface IDropdownSelect {
  label?: string
  bordered?: boolean
  options: IOption[]
  isSearch?: boolean
  placeHolder?: string
  selectedValues: string[]
  setSelectedValues: (value: string[]) => void
  placeholder?: string
  isMultiselect?: boolean
  firstSelected?: boolean
}

export const DropdownSelect = ({
  label,
  options,
  bordered = true,
  isSearch = false,
  selectedValues,
  setSelectedValues,
  placeholder = "All",
  isMultiselect = true,
  firstSelected = false,
}: IDropdownSelect) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  const ref = useClickOutside(() => setIsDropdownOpen(false))

  const toggleCheckbox = useCallback(
    (isChecked: boolean, value: string) => {
      const isChecking = !isChecked
      if (!isMultiselect) {
        setSelectedValues([value])
        return setIsDropdownOpen(false)
      }

      if (isChecking) setSelectedValues(selectedValues.concat([value]))
      else setSelectedValues(selectedValues.filter((v) => v !== value))
    },
    [isMultiselect, selectedValues, setSelectedValues],
  )

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchInput.toLowerCase()),
    )
  }, [options, searchInput])

  useEffect(() => {
    if (firstSelected && options.length) toggleCheckbox(false, options[0].value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={clsx("relative w-full")} ref={ref}>
      <label
        className={clsx(
          "text-xs tracking-[0.16px] leading-4 mb-1",
          "text-black-base",
        )}
      >
        {label}
      </label>
      <div
        className={clsx(
          "bg-white rounded-md h-10 p-2.5 w-full",
          "flex justify-between items-center",
          "cursor-pointer select-none",
          "active:outline active:outline-offset-1",
          bordered && "border border-black-base",
          isDropdownOpen && "border border-blue-600 bg-blue-50",
        )}
        style={{ boxShadow: isDropdownOpen ? "0px 0px 2px #0E62FF" : "" }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <p className={clsx("text-sm leading-5", !isMultiselect && "hidden")}>
          {selectedValues?.length
            ? `${selectedValues.length} selected`
            : placeholder}
        </p>
        <p className={clsx("text-sm leading-5", isMultiselect && "hidden")}>
          {selectedValues?.length
            ? options.find((o) => o.value === selectedValues[0])?.label
            : placeholder}
        </p>
        <img src={Arrow} alt="arrow" />
      </div>
      {isDropdownOpen && (
        <div
          className={clsx("w-full bg-white rounded-md mt-[1px] absolute z-50")}
          style={{ boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)" }}
        >
          {isSearch && (
            <Input
              type="text"
              icon={<IoIosSearch size="20" />}
              placeholder="Search"
              className="mx-[13px] mt-[13px]"
              onKeyUp={(e) => setSearchInput(e.target.value)}
            />
          )}
          <div className={clsx("max-h-[30vh] overflow-auto flex flex-col")}>
            {filteredOptions?.map((option) => (
              <label
                key={`option_${option.value}`}
                htmlFor={option.value}
                className={clsx(
                  "py-2.5 hover:bg-gray-100 cursor-pointer px-[13px]",
                  "flex items-center text-sm text-black-base",
                )}
              >
                <Checkbox
                  value={option.value}
                  isChecked={selectedValues.includes(option.value)}
                  onChange={toggleCheckbox}
                  className={clsx("mr-[13px]", !isMultiselect && "hidden")}
                />
                {option.icon && (
                  <img
                    className="mr-[13px] w-10 h-10 object-cover"
                    src={option.icon}
                    alt={option.value}
                  />
                )}
                <span className="w-full">{option.label}</span>
                <span className="text-gray-400 whitespace-nowrap">
                  {option.afterLabel}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
