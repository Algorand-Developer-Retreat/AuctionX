"use client"

import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { useWallet } from '@txnlab/use-wallet-react'
import ConnectWallet from "./ConnectWallet"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              AuctionX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link to="/create" className="text-foreground/80 hover:text-foreground transition-colors">
              Create Auction
            </Link>
            <Link to="/my-bids" className="text-foreground/80 hover:text-foreground transition-colors">
              My Bids
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <Button
              onClick={toggleWalletModal}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              data-test-id="connect-wallet"
            >
              {activeAddress ? formatAddress(activeAddress) : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            <button onClick={toggleMenu} className="text-foreground p-1">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors" onClick={toggleMenu}>
                Explore
              </Link>
              <Link
                to="/create"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={toggleMenu}
              >
                Create Auction
              </Link>
              <Link
                to="/my-bids"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={toggleMenu}
              >
                My Bids
              </Link>
              <Button
                onClick={toggleWalletModal}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                {activeAddress ? formatAddress(activeAddress) : "Connect Wallet"}
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Wallet Connection Modal - Moved outside the main container */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </header>
  )
}