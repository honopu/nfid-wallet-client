import { assetAbi } from "../asset-abi"
import { AssetDecoder, AssetId } from "../asset-decoder"
import {
  assetDecoderService,
  AssetDecoderService,
} from "../asset-decoder-service"

class Erc1155AssetDecoder implements AssetDecoder {
  private AssetDecoderService: AssetDecoderService

  constructor(AssetDecoderService: AssetDecoderService) {
    this.AssetDecoderService = AssetDecoderService
  }

  getAbi(): object {
    return assetAbi
  }

  getMethod(): string {
    return "0x973bb640"
  }

  map(data: string): AssetId {
    return this.AssetDecoderService.map(this.getAbi(), data)
  }
}

export const erc1155AssetDecoder = new Erc1155AssetDecoder(assetDecoderService)
