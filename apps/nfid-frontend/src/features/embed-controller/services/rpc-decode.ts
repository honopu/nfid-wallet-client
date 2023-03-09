import { decode, decodeTokenByAssetClass } from "@nfid/integration-ethereum"

import { EmbedControllerContext } from "../machine"

export const decodeRPCRequestService = async ({
  rpcMessage,
}: EmbedControllerContext) => {
  if (!rpcMessage?.params) throw new Error("No rpcMessage params")

  try {
    if (rpcMessage?.params.length > 1) {
      const data = rpcMessage?.params[1]
      if (data?.message?.tokenURI?.length) return data.message

      return await decodeTokenByAssetClass(
        data.message.makeAsset.assetType.assetClass,
        data.message.makeAsset.assetType.data,
      )
    } else return await decode(rpcMessage?.params[0].data)
  } catch (e: any) {
    throw new Error(e.message)
  }
}
