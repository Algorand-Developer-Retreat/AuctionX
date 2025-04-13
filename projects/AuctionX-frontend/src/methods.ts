import * as algokit from "@algorandfoundation/algokit-utils";
import { AuctionXClient, AuctionXFactory } from "./contracts/AuctionX";
import { TransactionSigner } from "algosdk";

export function createAuction(
  client: AuctionXClient,
  auctionId: number,
  startTime: number,
  endTime: number,
  minBidIncrement: number,
  minBidAmount: number,
  maxBidAmount: number,
  transactionSigner: TransactionSigner
) {
  
}