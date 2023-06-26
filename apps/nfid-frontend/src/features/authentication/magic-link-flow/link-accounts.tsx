import { Button, IconCmpGoogle, Image } from "@nfid-frontend/ui"

import LinkAsset from "../assets/link-accounts.png"
import { AuthAppMeta } from "../ui/app-meta"

export const EmailMagicLinkLink = () => {
  return (
    <>
      <AuthAppMeta title="Link account" />
      <p className="text-sm text-center">
        This email address has previously been registered. Link your account
        with Google to access your account through either a sign in link or
        Google sign in.
      </p>
      <Image src={LinkAsset} className="w-full h-56 my-10" />
      <Button
        className="h-12 !p-0"
        type="stroke"
        icon={<IconCmpGoogle />}
        block
      >
        Continue with Google
      </Button>
    </>
  )
}
