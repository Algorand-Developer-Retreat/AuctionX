from algopy import *
from algopy.arc4 import abimethod


class AuctionX(ARC4Contract):
    assetid: UInt64
    floorprice: UInt64
    highest_bid: UInt64
    highest_bidder: Account

    # Create the app
    @abimethod(allow_actions=["NoOp"])
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

    # Accept the highest bid
    @abimethod()
    def accept_bid(self) -> None:
        assert Txn.sender == Global.creator_address
        assert self.highest_bidder != Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")

        # Transfer the asset to the highest bidder
        itxn.AssetTransfer(
            xfer_asset=self.assetid,
            asset_receiver=self.highest_bidder,
            asset_amount=1,  # Assuming the asset is non-fungible (1 unit)
            fee=1_000,
        ).submit()

        # Transfer the funds to the market creator
        itxn.Payment(
            receiver=Global.creator_address,
            amount=self.highest_bid,
            fee=1_000,
        ).submit()

        # Reset the highest bid and bidder
        self.highest_bid = UInt64(0)
        self.highest_bidder = Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")

    # Reject the highest bid and refund the bidder
    @abimethod()
    def reject_bid(self) -> None:
        assert Txn.sender == Global.creator_address
        assert self.highest_bidder != Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")

        # Refund the highest bidder
        itxn.Payment(
            receiver=self.highest_bidder,
            amount=self.highest_bid,
            fee=1_000,
        ).submit()

        # Reset the highest bid and bidder
        self.highest_bid = UInt64(0)
        self.highest_bidder = Account("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")

    # Delete the app & take your assets and profit back
    @abimethod(allow_actions=["DeleteApplication"])
    def delete_application(self) -> None:
        # Only allow the creator to delete the application
        assert Txn.sender == Global.creator_address

        # Send all the unsold assets to the creator
        itxn.AssetTransfer(
            xfer_asset=self.assetid,
            asset_receiver=Global.creator_address,
            # The amount is 0, but the asset_close_to field is set
            # This means that ALL assets are being sent to the asset_close_to address
            asset_amount=0,
            # Close the asset to unlock the 0.1 ALGO that was locked in opt_in_to_asset
            asset_close_to=Global.creator_address,
            fee=1_000,
        ).submit()

        # Send the remaining balance to the creator
        itxn.Payment(
            receiver=Global.creator_address,
            amount=0,
            # Close the account to get back ALL the ALGO in the account
            close_remainder_to=Global.creator_address,
            fee=1_000,
        ).submit()