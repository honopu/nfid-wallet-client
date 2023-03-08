import { EmbedControllerContext } from "../machine"

export const MethodControllerService = async ({
  rpcMessage,
}: EmbedControllerContext) => {
  let dataString: string
  if (rpcMessage?.params && rpcMessage.params.length > 1) {
    const data = JSON.parse(rpcMessage.params[1])
    dataString = data.message.makeAsset.assetType.assetClass
  } else {
    dataString = rpcMessage?.params[0].data
  }

  // TODO: move to integration-ethereum package
  // "0x0d5f7d35" and "0x973bb640"
  if (dataString.startsWith("0x0d5f7d35")) return "Buy"
  if (dataString.startsWith("0x973bb640")) return "Sell"
  if (dataString.startsWith("0x27050d1f")) return "DeployCollection"
  if (dataString.startsWith("0x22a775b6")) return "Mint"

  return "Success"
}
