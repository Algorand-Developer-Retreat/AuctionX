# **AuctionX - Asset Auction Platform on Algorand**  

**AuctionX** is a **decentralized auction platform** built with **AlgoKit**, enabling secure, on-chain auctions for **any Algorand Standard Asset (ASA)**—NFTs, tokens, or real-world asset representations.  

---

## **🚀 Quick Start with AlgoKit**  

### **1. Initialize Project**  
Clone the repository and navigate to the project directory:  
```bash
cd AuctionX
```
Run this command to bootstrap **both frontend (React/Vite) and contracts (Algorand Python)**:  
```bash
algokit project bootstrap all
```  

### **2. Install Dependencies**  
```bash
npm install
```  

### **3. Configure Environment**  
Create `.env` in the project root:  
```env
VITE_ALGOD_NETWORK=testnet
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_TOKEN=

VITE_INDEXER_TOKEN=""
VITE_INDEXER_SERVER="https://testnet-idx.algonode.cloud"
VITE_INDEXER_PORT=""

```  

### **4. Run Development Server**  
```bash
npm run dev
```  

---

## **🔧 Key Features**  
✅ **AlgoKit-Powered** – Full-stack Algorand app (React + Algorand Python)  
✅ **Multi-Asset Auctions** – NFTs, tokens, or real-world assets  
✅ **Secure Escrow** – On-chain asset locking  
✅ **Wallet Support** – Pera, Defly, Exodus  

---

## **📜 Smart Contracts (Algorand Python)**  
Contracts are pre-configured in `/contracts` with:  
- **Auction Manager** – Handles bidding logic  
- **Asset Escrow** – Secures assets until auction ends  

**Deploy contracts:**  

You can deploy the contracts using Lora to test the functionality.
 

---



---

## **🔗 Wallet Integration**  
**Supported Wallets:**  
- Pera Wallet  
- Defly Wallet  
- Exodus  

**How to Connect:**  
1. Click **"Connect Wallet"**  
2. Select your wallet  
3. Approve the connection  

---

## **📜 License**  
**MIT License** – Open source and free to use.  

---

## **Need Help?**  
- [Algorand Developer Portal](https://dev.algorand.co/)  
- Open a **GitHub Issue**  

---

**Start building auctions in minutes!** 🚀  
```bash
algokit init
```  

Built with **AlgoKit** for seamless Algorand development. ⚡