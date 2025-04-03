from algopy import *
from algopy.arc4 import abimethod


class AuctionX(ARC4Contract):
    assetid: UInt64
    floorprice: UInt64
    highest_bid: UInt64
    highest_bidder: Account

    # Create the app
    @abimethod(allow_actions=["NoOp"], create="require")
    def create_application(self, asset_id: Asset, floor_price: UInt64) -> None:
        self.assetid = asset_id.id
        self.floorprice = floor_price
        self.highest_bid = UInt64(0)
        self.highest_bidder = Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")

    # Update the floor price
    @abimethod()
    def set_floor_price(self, floor_price: UInt64) -> None:
        assert Txn.sender == Global.creator_address
        self.floorprice = floor_price

    # Opt in to the asset that will be sold
    @abimethod()
    def opt_in_to_asset(self, mbrpay: gtxn.PaymentTransaction) -> None:
        assert Txn.sender == Global.creator_address
        assert not Global.current_application_address.is_opted_in(Asset(self.assetid))

        assert mbrpay.receiver == Global.current_application_address
        assert mbrpay.amount == Global.min_balance + Global.asset_opt_in_min_balance

        itxn.AssetTransfer(
            xfer_asset=self.assetid,
            asset_receiver=Global.current_application_address,
            asset_amount=0,
        ).submit()

    # Place a bid
    @abimethod()
    def place_bid(self, bid_payment: gtxn.PaymentTransaction) -> None:
        assert bid_payment.sender == Txn.sender
        assert bid_payment.receiver == Global.current_application_address
        assert bid_payment.amount > self.highest_bid
        assert bid_payment.amount >= self.floorprice

        # Refund the previous highest bidder
        if self.highest_bidder != Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"):
            itxn.Payment(
                receiver=self.highest_bidder,
                amount=self.highest_bid,
                fee=1_000,
            ).submit()

        # Update the highest bid and bidder
        self.highest_bid = bid_payment.amount
        self.highest_bidder = Txn.sender



 

