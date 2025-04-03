import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
              AuctionX
            </h3>
            <p className="text-foreground/70 max-w-xs">
              A decentralized auction platform built on Algorand blockchain, enabling secure and transparent bidding for
              digital assets.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-foreground/70 hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/create" className="text-foreground/70 hover:text-foreground transition-colors">
                  Create Auction
                </a>
              </li>
              <li>
                <a href="/my-bids" className="text-foreground/70 hover:text-foreground transition-colors">
                  My Bids
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border/40">
          <p className="text-center text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} AuctionX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

