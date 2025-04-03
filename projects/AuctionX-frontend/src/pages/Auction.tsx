"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, AlertCircle, CheckCircle, User, DollarSign, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toaster"
import { useWallet } from "@txnlab/use-wallet-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for auctions (same as in Home.tsx)
const mockAuctions = [
  {
    id: "1",
    title: "Cosmic Voyager #42",
    description: "Limited edition digital artwork from the Cosmic Voyager collection",
    assetId: "12345678",
    floorPrice: 100,
    highestBid: 150,
    highestBidder: "ALGO123...XYZ",
    endTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO456...ABC",
    category: "art",
    bids: [
      { bidder: "ALGO123...XYZ", amount: 150, time: new Date(Date.now() - 3600000) },
      { bidder: "ALGO789...DEF", amount: 125, time: new Date(Date.now() - 7200000) },
      { bidder: "ALGO456...GHI", amount: 110, time: new Date(Date.now() - 10800000) },
    ],
  },
  {
    id: "2",
    title: "AlgoKnight #007",
    description: "Rare NFT from the AlgoKnight collection",
    assetId: "87654321",
    floorPrice: 200,
    highestBid: 250,
    highestBidder: "ALGO789...DEF",
    endTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO456...ABC",
    category: "collectible",
    bids: [
      { bidder: "ALGO789...DEF", amount: 250, time: new Date(Date.now() - 1800000) },
      { bidder: "ALGO123...XYZ", amount: 225, time: new Date(Date.now() - 5400000) },
    ],
  },
  {
    id: "3",
    title: "Virtual Land Plot #1337",
    description: "Prime location in the Algorand Metaverse",
    assetId: "13371337",
    floorPrice: 500,
    highestBid: 550,
    highestBidder: "ALGO999...GHI",
    endTime: new Date(Date.now() + 86400000 * 1), // 1 day from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO222...JKL",
    category: "virtual-land",
    bids: [
      { bidder: "ALGO999...GHI", amount: 550, time: new Date(Date.now() - 900000) },
      { bidder: "ALGO333...MNO", amount: 525, time: new Date(Date.now() - 3600000) },
      { bidder: "ALGO444...PQR", amount: 510, time: new Date(Date.now() - 7200000) },
    ],
  },
  {
    id: "4",
    title: "Algo Legends: Rare Sword",
    description: "Legendary weapon for the Algo Legends game",
    assetId: "98765432",
    floorPrice: 50,
    highestBid: 75,
    highestBidder: "ALGO333...MNO",
    endTime: new Date(Date.now() + 86400000 * 4), // 4 days from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO444...PQR",
    category: "gaming",
    bids: [
      { bidder: "ALGO333...MNO", amount: 75, time: new Date(Date.now() - 1200000) },
      { bidder: "ALGO555...STU", amount: 60, time: new Date(Date.now() - 4800000) },
    ],
  },
  {
    id: "5",
    title: "Digital Identity Pass",
    description: "Exclusive membership to the Algorand DAO",
    assetId: "55555555",
    floorPrice: 300,
    highestBid: 300,
    highestBidder: "",
    endTime: new Date(Date.now() + 86400000 * 5), // 5 days from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO555...STU",
    category: "membership",
    bids: [],
  },
  {
    id: "6",
    title: "Algo Punk #24",
    description: "Punk-style avatar for the Algorand ecosystem",
    assetId: "24242424",
    floorPrice: 150,
    highestBid: 200,
    highestBidder: "ALGO666...VWX",
    endTime: new Date(Date.now() + 86400000 * 2.5), // 2.5 days from now
    image: "/placeholder.svg?height=400&width=400",
    creator: "ALGO777...YZA",
    category: "art",
    bids: [
      { bidder: "ALGO666...VWX", amount: 200, time: new Date(Date.now() - 2400000) },
      { bidder: "ALGO777...YZA", amount: 175, time: new Date(Date.now() - 6000000) },
      { bidder: "ALGO888...BCD", amount: 160, time: new Date(Date.now() - 9600000) },
    ],
  },
]

export default function Auction() {
  const { id } = useParams()
  const [auction, setAuction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [timeLeft, setTimeLeft] = useState("")
  const { activeAddress } = useWallet()
  const { toast } = useToast()
  const [isCreator, setIsCreator] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  useEffect(() => {
    // Simulate fetching auction data
    setTimeout(() => {
      const foundAuction = mockAuctions.find((a) => a.id === id)
      setAuction(foundAuction || null)
      setLoading(false)

      if (foundAuction && activeAddress) {
        // Check if connected wallet is the creator
        setIsCreator(foundAuction.creator.startsWith(activeAddress.substring(0, 8)))

        // Set initial bid amount to minimum required (highest bid + 1 or floor price)
        const minBid = foundAuction.highestBid > 0 ? foundAuction.highestBid + 1 : foundAuction.floorPrice
        setBidAmount(minBid.toString())
      }
    }, 500)
  }, [id, activeAddress])

  useEffect(() => {
    if (!auction) return

    const updateTimeLeft = () => {
      const now = new Date()
      const endTime = new Date(auction.endTime)
      const diff = endTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Auction ended")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [auction])

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!activeAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place a bid.",
        variant: "destructive",
      })
      window.dispatchEvent(new CustomEvent("connect-wallet"))
      return
    }

    const bidValue = Number.parseFloat(bidAmount)

    if (isNaN(bidValue)) {
      toast({
        title: "Invalid bid amount",
        description: "Please enter a valid number.",
        variant: "destructive",
      })
      return
    }

    if (bidValue <= auction.highestBid) {
      toast({
        title: "Bid too low",
        description: `Your bid must be higher than the current highest bid (${auction.highestBid} ALGO).`,
        variant: "destructive",
      })
      return
    }

    if (bidValue < auction.floorPrice) {
      toast({
        title: "Bid too low",
        description: `Your bid must be at least the floor price (${auction.floorPrice} ALGO).`,
        variant: "destructive",
      })
      return
    }

    // Here you would integrate with the smart contract
    // For now, we'll just show a success message
    toast({
      title: "Bid placed successfully!",
      description: `You've placed a bid of ${bidValue} ALGO.`,
    })
  }

  const handleAcceptBid = () => {
    // Here you would integrate with the smart contract's accept_bid function
    toast({
      title: "Bid accepted",
      description: `You've accepted the highest bid of ${auction.highestBid} ALGO.`,
    })
    setShowAcceptDialog(false)
  }

  const handleRejectBid = () => {
    // Here you would integrate with the smart contract's reject_bid function
    toast({
      title: "Bid rejected",
      description: "The highest bid has been rejected and the bidder will be refunded.",
    })
    setShowRejectDialog(false)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const handleConnectWallet = () => {
    window.dispatchEvent(new CustomEvent("connect-wallet"))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to auctions
        </Link>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Browse Auctions</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isAuctionEnded = new Date(auction.endTime) < new Date()
  const minBidAmount = auction.highestBid > 0 ? auction.highestBid + 1 : auction.floorPrice

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to auctions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="rounded-lg overflow-hidden border bg-card">
          <img src={auction.image || "/placeholder.svg"} alt={auction.title} className="w-full h-auto object-cover" />
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-sm">
                Asset #{auction.assetId}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {auction.category.replace("-", " ")}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
            <p className="text-muted-foreground mb-4">{auction.description}</p>

            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <User className="h-4 w-4 mr-1" />
              <span>Created by {auction.creator}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>Floor Price</span>
                  </div>
                  <p className="text-xl font-semibold">{auction.floorPrice} ALGO</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>Current Bid</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {auction.highestBid > 0 ? `${auction.highestBid} ALGO` : "No bids yet"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{isAuctionEnded ? "Auction ended" : "Time remaining"}</span>
              </div>
              <p className="text-lg font-medium">{timeLeft}</p>
            </div>

            {isAuctionEnded ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Auction Ended</AlertTitle>
                <AlertDescription>This auction has ended and is no longer accepting bids.</AlertDescription>
              </Alert>
            ) : isCreator ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>You are the creator</AlertTitle>
                  <AlertDescription>
                    As the creator of this auction, you can accept or reject the highest bid.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-4">
                  {auction.highestBid > 0 ? (
                    <>
                      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-gradient-to-r from-green-600 to-green-500">
                            Accept Highest Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Accept Highest Bid</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to accept the highest bid of {auction.highestBid} ALGO from{" "}
                              {auction.highestBidder}? This will transfer the asset to the bidder and cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAcceptBid} className="bg-gradient-to-r from-green-600 to-green-500">
                              Accept Bid
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            Reject Highest Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Highest Bid</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reject the highest bid of {auction.highestBid} ALGO from{" "}
                              {auction.highestBidder}? The bidder will be refunded their bid amount.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleRejectBid}>
                              Reject Bid
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <Button disabled className="flex-1">
                      No Bids to Accept
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="bidAmount" className="text-sm font-medium mb-2">
                    Your Bid (minimum {minBidAmount} ALGO)
                  </label>
                  <div className="flex">
                    <Input
                      id="bidAmount"
                      type="number"
                      min={minBidAmount}
                      step="1"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="rounded-r-none"
                      required
                    />
                    <div className="flex items-center justify-center px-4 border border-l-0 rounded-r-md bg-muted">
                      ALGO
                    </div>
                  </div>
                </div>

                {activeAddress ? (
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500">
                    Place Bid
                  </Button>
                ) : (
                  <Button type="button" onClick={handleConnectWallet} className="w-full">
                    Connect Wallet to Bid
                  </Button>
                )}
              </form>
            )}
          </div>

          {/* Bid History */}
          <Tabs defaultValue="history" className="mt-8">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="history">Bid History</TabsTrigger>
              <TabsTrigger value="details">Asset Details</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="pt-4">
              {auction.bids.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No bids have been placed yet.</p>
              ) : (
                <div className="space-y-4">
                  {auction.bids.map((bid: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{bid.bidder}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(bid.time)}</p>
                      </div>
                      <p className="font-semibold">{bid.amount} ALGO</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Asset ID</div>
                  <div>{auction.assetId}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Creator</div>
                  <div>{auction.creator}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="capitalize">{auction.category.replace("-", " ")}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Floor Price</div>
                  <div>{auction.floorPrice} ALGO</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">End Time</div>
                  <div>{formatDate(auction.endTime)}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

