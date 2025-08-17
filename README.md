# Cute Thoughts Frontend

A Web3 frontend application for generating and sharing cute, positive thoughts on the Base blockchain. Users can connect their wallets to generate uplifting thoughts and optionally tip ETH to spread positivity.

## Features

- 🔗 **Wallet Integration**: Connect with MetaMask or WalletConnect
- 💭 **Thought Generation**: Generate cute thoughts for free or with ETH tips
- 🌐 **Social Sharing**: Share thoughts on Twitter, Farcaster, and Instagram
- 🎨 **Cute Aesthetic**: Custom designed UI with adorable color scheme
- ⚡ **Base Network**: Built on Ethereum L2 for fast, low-cost transactions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom cute theme
- **Shadcn/ui** components built on Radix UI
- **Wouter** for lightweight routing
- **TanStack Query** for server state management

### Web3 Integration
- **Wagmi** for Ethereum wallet connections and contract interactions
- **Viem** for low-level Ethereum client operations
- **RainbowKit** for wallet connection UI
- **Base Network** (Ethereum L2)

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Neon Database** for serverless PostgreSQL hosting

## Smart Contract

The application interacts with the `CuteThoughtsGenerator` smart contract deployed on Base mainnet:

**Contract Address**: `0x7B096f6836bF28194061870EA4DFae8196F4b14d`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anshuman-dev/cute-thoughts-frontend.git
cd cute-thoughts-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```bash
# Database
DATABASE_URL="your-postgresql-connection-string"

# Optional: Custom RPC endpoints
VITE_BASE_RPC_URL="https://mainnet.base.org"
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and choose MetaMask or WalletConnect
2. **Generate Thoughts**: 
   - Click "Generate Free Thought" for a no-cost positive message
   - Use "Generate with Tip" to send ETH along with your thought
3. **Share**: Use the social media buttons to share your thoughts on Twitter, Farcaster, or Instagram
4. **View History**: See all generated thoughts in the main feed

## Social Sharing

- **Twitter**: Direct integration through Twitter Web Intents
- **Farcaster**: Warpcast composer integration for decentralized social sharing  
- **Instagram**: Clipboard-based sharing for Instagram Stories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for spreading positivity in the Web3 space
- Powered by Base network for fast and affordable transactions
- Thanks to the amazing Web3 developer community

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with 💖 by [anshuman-dev](https://github.com/anshuman-dev)