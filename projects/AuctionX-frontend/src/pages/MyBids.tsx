"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, AlertCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toaster"
import { useWallet } from "@txnlab/use-wallet-react"

// Mock data for user's bids
const mockMyBids = [
  {
    id: "1",
    auctionId: "1",
    title: "Cosmic Voyager #42",
    assetId: "12345678",
    bidAmount: 150,
    bidTime: new Date(Date.now() - 3600000),
    status: "highest", // highest, outbid, won, lost
    endTime: new Date(Date.now() + 86400000 * 2),
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "2",
    auctionId: "3",
    title: "Virtual Land Plot #1337",
    assetId: "13371337",
    bidAmount: 525,
    bidTime: new Date(Date.now() - 3600000 * 2),
    status: "outbid",
    endTime: new Date(Date.now() + 86400000 * 1),
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "3",
    auctionId: "6",
    title: "Algo Punk #24",
    assetId: "24242424",
    bidAmount: 175,
    bidTime: new Date(Date.now() - 6000000),
    status: "outbid",
    endTime: new Date(Date.now() + 86400000 * 2.5),
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "4",
    auctionId: "4",
    title: "Algo Legends: Rare Sword",
    assetId: "98765432",
    bidAmount: 60,
    bidTime: new Date(Date.now() - 4800000),
    status: "outbid",
    endTime: new Date(Date.now() + 86400000 * 4),
    image: "/placeholder.svg?height=400&width=400",
  },
]

// Mock data for auctions created by the user
const mockMyAuctions = [
  {
    id: "5",
    title: "Digital Identity Pass",
    assetId: "55555555",
    floorPrice: 300,
    highestBid: 300,
    highestBidder: "",
    endTime: new Date(Date.now() + 86400000 * 5),
    image: "/placeholder.svg?height=400&width=400",
    status: "active", // active, ended, sold
  },
  {
    id: "6",
    title: "Algo Punk #24",
    assetId: "24242424",
    floorPrice: 150,
    highestBid: 200,
    highestBidder: "ALGO666...VWX",
    endTime: new Date(Date.now() + 86400000 * 2.5),
    image: "/placeholder.svg?height=400&width=400",
    status: "active",
  },
]

export default function MyBids() {
  const { activeAddress } = useWallet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("my-bids")
  const [myBids, setMyBids] = useState<any[]>([])
  const [myAuctions, setMyAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeAddress) {
      // Simulate fetching data
      setTimeout(() => {
        setMyBids(mockMyBids)
        setMyAuctions(mockMyAuctions)
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [activeAddress])

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return "Ending soon"
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "highest":
        return <Badge className="bg-green-500">Highest Bid</Badge>
      case "outbid":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Outbid
          </Badge>
        )
      case "won":
        return <Badge className="bg-purple-500">Won</Badge>
      case "lost":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Lost
          </Badge>
        )
      case "active":
        return <Badge className="bg-blue-500">Active</Badge>
      case "ended":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Ended
          </Badge>
        )
      case "sold":
        return <Badge className="bg-green-500">Sold</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleConnectWallet = () => {
    window.dispatchEvent(new CustomEvent("connect-wallet"))
  }

  if (!activeAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">Connect your wallet to view your bids and auctions.</p>
          <Button onClick={handleConnectWallet} className="bg-gradient-to-r from-purple-600 to-blue-500">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <Tabs defaultValue="my-bids" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-bids">My Bids</TabsTrigger>
          <TabsTrigger value="my-auctions">My Auctions</TabsTrigger>
        </TabsList>

        <TabsContent value="my-bids" className="pt-6">
          {myBids.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Bids Found</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any bids yet.</p>
              <Button asChild>
                <Link to="/">Browse Auctions</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBids.map((bid) => (
                <Link to={`/auction/${bid.auctionId}`} key={bid.id}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={bid.image || "/placeholder.svg"}
                        alt={bid.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        {getStatusBadge(bid.status)}
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          {formatTimeLeft(bid.endTime)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{bid.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Your Bid</p>
                          <p className="font-medium">{bid.bidAmount} ALGO</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Bid Time</p>
                          <p className="text-sm">{formatDate(bid.bidTime)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        Asset #{bid.assetId}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTimeLeft(bid.endTime)}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-auctions" className="pt-6">
          {myAuctions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Auctions Found</h2>
              <p className="text-muted-foreground mb-6">You haven't created any auctions yet.</p>
              <Button asChild>
                <Link to="/create">Create Auction</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAuctions.map((auction) => (
                <Link to={`/auction/${auction.id}`} key={auction.id}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        {getStatusBadge(auction.status)}
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          {formatTimeLeft(auction.endTime)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{auction.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Floor Price</p>
                          <p className="font-medium">{auction.floorPrice} ALGO</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Highest Bid</p>
                          <p className="font-medium">
                            {auction.highestBid > 0 ? `${auction.highestBid} ALGO` : "No bids"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        Asset #{auction.assetId}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTimeLeft(auction.endTime)}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

