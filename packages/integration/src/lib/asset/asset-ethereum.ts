import {
  Activity as RaribleActivity,
  TransferActivity,
  ActivitySort,
  ActivityType,
  OrderMatchSell,
  Item as RaribleItem,
  UserActivityType,
} from "@rarible/api-client"
import { Blockchain } from "@rarible/api-client"
import { EthersEthereum } from "@rarible/ethers-ethereum"
import { createRaribleSdk, IRaribleSdk } from "@rarible/sdk"
import { EthereumWallet } from "@rarible/sdk-wallet"
import {
  convertEthereumToUnionAddress,
  convertEthereumItemId,
  EVMBlockchain,
} from "@rarible/sdk/build/sdk-blockchains/ethereum/common"
import { toCurrencyId, UnionAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import {
  Network,
  Alchemy,
  SortingOrder,
  AssetTransfersCategory,
} from "alchemy-sdk"
import { ethers } from "ethers-ts"

import { EthWallet } from "../ecdsa-signer/ecdsa-wallet"
import {
  NonFungibleAsset,
  ChainBalance,
  ActivityRecord,
  NonFungibleActivityRecords,
  NonFungibleItem,
  NonFungibleItems,
  FungibleActivityRecords,
  Tokens,
  FungibleActivityRequest,
  Configuration,
  ActivitiesByItemRequest,
  PageRequest,
  SortRequest,
} from "./types"

declare const FRONTEND_MODE: string
declare const ALCHEMY_API_KEY: string

class EthereumAsset implements NonFungibleAsset {
  readonly blockchain: EVMBlockchain
  readonly unionBlockchain: EVMBlockchain
  readonly currencyId: string
  readonly raribleSdk: IRaribleSdk
  readonly wallet: EthWallet
  readonly alchemySdk: Alchemy

  constructor(config: Configuration) {
    const [raribleSdk, wallet] = this.getRaribleSdk(FRONTEND_MODE, config)
    this.alchemySdk = this.getAlchemySdk(FRONTEND_MODE, config)
    this.raribleSdk = raribleSdk
    this.wallet = wallet
    this.blockchain = config.blockchain
    this.currencyId = config.currencyId
    this.unionBlockchain = config.unionBlockchain
  }

  public async getActivitiesByItem({
    tokenId,
    contract,
    cursor,
    size,
    sort,
  }: ActivitiesByItemRequest): Promise<NonFungibleActivityRecords> {
    const itemId = convertEthereumItemId(
      `${contract}:${tokenId}`,
      this.blockchain,
    )
    const raribleActivities =
      await this.raribleSdk.apis.activity.getActivitiesByItem({
        type: [ActivityType.SELL, ActivityType.TRANSFER],
        itemId,
        cursor,
        size,
        sort:
          "asc" === sort
            ? ActivitySort.EARLIEST_FIRST
            : ActivitySort.LATEST_FIRST,
      })

    return {
      activities: raribleActivities.activities.map(this.mapActivity),
      cursor: raribleActivities.cursor,
    }
  }

  public async getActivitiesByUser({
    cursor,
    size,
    sort,
  }: PageRequest & SortRequest = {}): Promise<NonFungibleActivityRecords> {
    const address = await this.wallet.getAddress()
    const unionAddress: UnionAddress = convertEthereumToUnionAddress(
      address,
      this.unionBlockchain,
    )
    const raribleActivities =
      await this.raribleSdk.apis.activity.getActivitiesByUser({
        type: [
          UserActivityType.SELL,
          UserActivityType.TRANSFER_FROM,
          UserActivityType.TRANSFER_TO,
          UserActivityType.BUY,
        ],
        user: [unionAddress],
        cursor,
        size,
        blockchains: [this.blockchain],
        sort:
          "asc" === sort
            ? ActivitySort.EARLIEST_FIRST
            : ActivitySort.LATEST_FIRST,
      })
    return {
      activities: raribleActivities.activities.map(this.mapActivity),
      cursor: raribleActivities.cursor,
    }
  }

  public async getItemsByUser({
    cursor,
    size,
    address,
  }: PageRequest = {}): Promise<NonFungibleItems> {
    const validAddress = address ?? (await this.wallet.getAddress())

    const unionAddress: UnionAddress = convertEthereumToUnionAddress(
      validAddress,
      this.unionBlockchain,
    )
    const raribleItems = await this.raribleSdk.apis.item.getItemsByOwner({
      owner: unionAddress,
      size,
      continuation: cursor,
      blockchains: [this.blockchain],
    })
    return {
      total: raribleItems.total,
      items: raribleItems.items.map(this.mapItem),
    }
  }

  public async getBalance(): Promise<ChainBalance> {
    const address = await this.wallet.getAddress()
    const unionAddress: UnionAddress = convertEthereumToUnionAddress(
      address,
      this.unionBlockchain,
    )
    const now = new Date()
    const [balance, currencyRate] = await Promise.all([
      this.raribleSdk.balances.getBalance(
        unionAddress,
        toCurrencyId(this.currencyId),
      ),
      this.raribleSdk.apis.currency.getCurrencyUsdRateByCurrencyId({
        currencyId: this.currencyId,
        at: now,
      }),
    ])
    const balanceBN = toBn(balance)
    const balanceinUsd = toBn(currencyRate.rate).multipliedBy(balanceBN)
    return { balance: balanceBN, balanceinUsd }
  }

  public async transferNft(
    tokenId: string,
    contract: string,
    receiver: string,
  ): Promise<void> {
    this.wallet.safeTransferFrom(receiver, contract, tokenId)
  }

  public async getErc20TokensByUser({
    cursor,
  }: PageRequest = {}): Promise<Tokens> {
    const address = await this.wallet.getAddress()
    const tokens = await this.alchemySdk.core.getTokensForOwner(address, {
      pageKey: cursor,
    })
    return {
      cursor: tokens.pageKey,
      tokens: tokens.tokens
        .filter((x) => x.rawBalance !== undefined && 0 != +x.rawBalance)
        .map((x) => ({
          name: x.name || "N/A",
          symbol: x.symbol || "N/A",
          logo: x.logo,
          balance: x.balance || "0.0",
          contractAddress: x.contractAddress,
        })),
    }
  }

  public async getFungibleActivityByTokenAndUser({
    direction = "from",
    contract,
    cursor,
    size,
    sort = "desc",
  }: FungibleActivityRequest = {}): Promise<FungibleActivityRecords> {
    const address = await this.wallet.getAddress()
    const transfers = await this.alchemySdk.core.getAssetTransfers({
      fromAddress: "from" == direction ? address : undefined,
      toAddress: "to" == direction ? address : undefined,
      category: contract
        ? [AssetTransfersCategory.ERC20]
        : [AssetTransfersCategory.EXTERNAL],
      withMetadata: true,
      order: "asc" == sort ? SortingOrder.ASCENDING : SortingOrder.DESCENDING,
      maxCount: size,
      pageKey: cursor,
    })
    return {
      cursor: transfers.pageKey,
      activities: transfers.transfers.map((x) => ({
        id: x.uniqueId,
        date: x.metadata.blockTimestamp,
        to: x.to || "N/A",
        from: x.from,
        transactionHash: x.hash,
        price: x.value || 0,
      })),
    }
  }

  private mapActivity(activity: RaribleActivity): ActivityRecord {
    switch (activity["@type"]) {
      case "SELL": {
        const sell = activity as OrderMatchSell
        return {
          id: sell.id.toString(),
          type: sell["@type"].toString(),
          date: sell.date,
          to: sell.buyer.toString(),
          from: sell.seller.toString(),
          transactionHash: activity.transactionHash,
          price: sell.price.toString(),
          priceUsd: sell.priceUsd?.toString(),
        }
      }
      case "TRANSFER": {
        const transfer = activity as TransferActivity
        return {
          id: transfer.id.toString(),
          type: transfer["@type"].toString(),
          date: transfer.date,
          from: transfer.from.toString(),
          to: transfer.owner.toString(),
          transactionHash: activity.transactionHash,
        }
      }
      default: {
        throw Error("Not supported Activity Type.")
      }
    }
  }

  private mapItem(raribleItem: RaribleItem): NonFungibleItem {
    return {
      id: raribleItem.id.toString(),
      blockchain: raribleItem.blockchain.toString(),
      collection: raribleItem.collection?.toString(),
      contract: raribleItem.contract?.toString(),
      tokenId: raribleItem.tokenId?.toString(),
      lastUpdatedAt: raribleItem.lastUpdatedAt.toString(),
    }
  }

  private getRaribleSdk(
    mode: string,
    config: Configuration,
  ): [IRaribleSdk, EthWallet] {
    const network = "production" == FRONTEND_MODE ? "prod" : "testnet"
    const url =
      "production" == mode ? config.provider.mainnet : config.provider.testnet
    const rpcProvider = new ethers.providers.JsonRpcProvider(url)
    const wallet = new EthWallet(rpcProvider)
    const ethersWallet = new EthereumWallet(new EthersEthereum(wallet))
    const raribleSdk = createRaribleSdk(ethersWallet, network)

    return [raribleSdk, wallet]
  }

  private getAlchemySdk(mode: string, config: Configuration): Alchemy {
    const alchemyNetwork: Network =
      "production" == mode ? config.alchemy.mainnet : config.alchemy.testnet
    return new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: alchemyNetwork,
    })
  }
}

export const ethereumAsset = new EthereumAsset({
  currencyId: "ETHEREUM:0x0000000000000000000000000000000000000000",
  blockchain: Blockchain.ETHEREUM as EVMBlockchain,
  unionBlockchain: Blockchain.ETHEREUM as EVMBlockchain,
  provider: {
    mainnet: "https://ethereum.publicnode.com",
    testnet: "https://ethereum-goerli-rpc.allthatnode.com",
  },
  alchemy: { mainnet: Network.ETH_MAINNET, testnet: Network.ETH_GOERLI },
})

export const polygonAsset = new EthereumAsset({
  currencyId: "POLYGON:0x0000000000000000000000000000000000000000",
  blockchain: Blockchain.POLYGON as EVMBlockchain,
  unionBlockchain: Blockchain.ETHEREUM as EVMBlockchain,
  provider: {
    mainnet: "https://polygon-mainnet.infura.io",
    testnet: "https://rpc-mumbai.maticvigil.com",
  },
  alchemy: { mainnet: Network.MATIC_MAINNET, testnet: Network.MATIC_MUMBAI },
})
