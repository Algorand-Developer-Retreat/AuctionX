"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@txnlab/use-wallet-react"
import ConnectWallet from "../components/ConnectWallet"

// Mock data for auctions
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
    image: "https://res.cloudinary.com/dmebegin1/image/upload/v1743961648/Cosmic_Voyager_final_fhplnq.jpg",
    creator: "ALGO456...ABC",
    category: "art",
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
    image: "https://res.cloudinary.com/dmebegin1/image/upload/v1743961638/76f5c4d9-06a5-4730-b099-9bdef4c854f0_gzbdgk.jpg",
    creator: "ALGO456...ABC",
    category: "collectible",
  },
  {
    id: "3",
    title: "Land Plot #1337",
    description: "Prime location in the Algorand Metaverse - soon coming",
    assetId: "13371337",
    floorPrice: 500,
    highestBid: 550,
    highestBidder: "ALGO999...GHI",
    endTime: new Date(Date.now() + 86400000 * 1), // 1 day from now
    image: "https://res.cloudinary.com/dmebegin1/image/upload/v1743961657/virtual_land_whiebq.jpg",
    creator: "ALGO222...JKL",
    category: "virtual-land",
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
  },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [auctions, setAuctions] = useState(mockAuctions)
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions)
  const [activeCategory, setActiveCategory] = useState("all")
  const { activeAddress } = useWallet()
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  useEffect(() => {
    // Filter auctions based on search term and active category
    const filtered = auctions.filter((auction) => {
      const matchesSearch =
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.assetId.includes(searchTerm)

      const matchesCategory = activeCategory === "all" || auction.category === activeCategory

      return matchesSearch && matchesCategory
    })

    setFilteredAuctions(filtered)
  }, [searchTerm, activeCategory, auctions])

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Discover, Bid, Collect
        </h1>
        <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto">
          The premier decentralized auction platform on Algorand blockchain
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {activeAddress ? (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Link to="/create">Create Auction</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={toggleWalletModal}
            >
              Connect Wallet
            </Button>
          )}
          <Button asChild variant="outline" size="lg">
            <Link to="/my-bids">View My Bids</Link>
          </Button>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, description, or asset ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="art">Art</TabsTrigger>
            <TabsTrigger value="collectible">Collectibles</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="virtual-land">Virtual Land</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Auctions Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Active Auctions</h2>

        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No auctions found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <Link to={`/auction/${auction.id}`} key={auction.id}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground">
                      {formatTimeLeft(auction.endTime)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{auction.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{auction.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Bid</p>
                        <p className="font-medium">
                          {auction.highestBid > 0 ? `${auction.highestBid} ALGO` : "No bids yet"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Floor Price</p>
                        <p className="font-medium">{auction.floorPrice} ALGO</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      Asset #{auction.assetId}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {auction.category.replace("-", " ")}
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}