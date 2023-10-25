import clsx from "clsx"
import useSWR from "swr"

import { Loader, RadioButton } from "@nfid-frontend/ui"
import { truncateString } from "@nfid-frontend/utils"
import { authState } from "@nfid/integration"

import { ProfileTypes } from "../choose-account"
import { getPublicProfile } from "../choose-account/services"

export interface IPublicProfileButton {
  isAvailable: boolean
  selectedProfile: ProfileTypes
  setSelectedProfile: (value: ProfileTypes) => void
}
export const PublicProfileButton = ({
  isAvailable,
  setSelectedProfile,
  selectedProfile,
}: IPublicProfileButton) => {
  const {
    data: publicProfile,
    isValidating,
    isLoading,
  } = useSWR(authState ? "publicProfile" : null, getPublicProfile, {
    revalidateOnFocus: false,
  })

  if (!publicProfile || isValidating || isLoading)
    return (
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white rounded-xl">
        <Loader imageClasses="w-16" isLoading={true} fullscreen={false} />
      </div>
    )

  return (
    <div
      className={clsx(
        "flex justify-between text-xs uppercase font-mono h-5 mt-5",
        !isAvailable && "!text-gray-400 !pointer-events-none",
      )}
    >
      <div className="flex items-center">
        <RadioButton
          id="profile_public"
          onChange={(e) => setSelectedProfile(e.target.value as ProfileTypes)}
          value="public"
          checked={selectedProfile === "public"}
          name={"profile"}
          disabled={!isAvailable}
        />
        <label htmlFor="profile_public" className="ml-2 cursor-pointer">
          {truncateString(publicProfile.address, 12, 5)}
        </label>
      </div>
      {publicProfile?.balance ? <div>{publicProfile?.balance} ICP</div> : null}
    </div>
  )
}
