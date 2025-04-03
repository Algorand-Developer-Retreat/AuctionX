from algopy import *
from algopy.arc4 import abimethod


class AuctionX(ARC4Contract):
    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name
