import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <Dialog open={openModal} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select wallet provider</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {activeAddress && (
            <>
              <Account />
              <div className="border-t my-4" />
            </>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <Button
                variant="outline"
                key={`provider-${wallet.id}`}
                className="justify-start gap-4 h-14"
                onClick={() => wallet.connect()}
              >
                {!isKmd(wallet) && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span>{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>
              </Button>
            ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          {activeAddress && (
            <Button
              variant="destructive"
              onClick={async () => {
                if (wallets) {
                  const activeWallet = wallets.find((w) => w.isActive)
                  if (activeWallet) {
                    await activeWallet.disconnect()
                  } else {
                    localStorage.removeItem('@txnlab/use-wallet:v3')
                    window.location.reload()
                  }
                }
              }}
            >
              Logout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWallet