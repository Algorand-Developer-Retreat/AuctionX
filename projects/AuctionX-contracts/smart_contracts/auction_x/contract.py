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





 

