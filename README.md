# Memory Trainer - Base Mini App

A retro electronic memory training game built on Base L2 with Web3 leaderboard integration.

## 🎮 Game Features

- **Retro Design**: Matte-black cross/square body with rounded corners
- **Classic Gameplay**: Four colored buttons (Red, Yellow, Green, Blue) with memory sequence mechanics
- **Game Modes**: Classic (Color + Sound) and Silent (Color Only)
- **Web3 Integration**: Global on-chain leaderboard on Base L2
- **Haptic Feedback**: Tactile vibration on mobile devices
- **Neon Effects**: Retro 80s-style lighting effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MetaMask or Coinbase Wallet
- Base L2 network configured in wallet

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd memory-trainer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .example.env .env.local
```

4. Configure your environment variables:
```bash
# Required for Web3 functionality
NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_URL=http://localhost:3000

# For contract deployment (optional)
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Game Mechanics

### Visual Design
- **Matte-black cross/square body** with rounded corners
- **Four colored buttons** positioned at corners:
  - 🔴 Red (Top-right)
  - 🟡 Yellow (Top-left) 
  - 🟢 Green (Bottom-left)
  - 🔵 Blue (Bottom-right)
- **Central purple display** with MEMORY logo and brain icon
- **Score display** showing current score, best score, game mode, and wallet status

### Gameplay
1. **Sequence Generation**: Game generates random sequence of button flashes
2. **Player Input**: User must repeat the sequence in exact order
3. **Progression**: Each successful round increases sequence length and speed
4. **Game Over**: Ends on wrong input or timeout
5. **Score Saving**: Submit high scores to Base L2 leaderboard

### Game Modes
- **🔊 Classic Mode**: Color + Sound (retro 80s tones)
- **🔇 Silent Mode**: Color only (for quiet environments)

## 🔗 Web3 Integration

### Smart Contract
The `BaseMemoryLeaderboard` contract handles:
- Player score storage on Base L2
- Global top 10 leaderboard
- Score submission via micro-transactions (0 ETH value)
- Transparent and immutable record keeping

### Contract Functions
- `submitScore(uint256 score)`: Submit a new high score
- `getTopScores()`: Get the current top 10 scores
- `getPlayerBestScore(address player)`: Get player's best score
- `getLeaderboardStats()`: Get leaderboard statistics

### Deployment

1. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

2. Update your `.env.local` with the deployed contract address:
```bash
NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS=0x...
```

3. Verify the contract on Base scan (optional but recommended):
```bash
npx hardhat verify --network base-sepolia <contract_address>
```

## 📱 Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Haptic Feedback**: Vibration on button presses (mobile devices)
- **Touch Optimization**: Large touch targets for easy gameplay
- **PWA Ready**: Can be installed as Progressive Web App

## 🎨 Styling

The game uses CSS Modules with:
- **Retro electronic color scheme**: Matte blacks, neon colors
- **Gradient backgrounds**: Purple central display with neon glow
- **Shadow effects**: Multiple layered shadows for depth
- **Neon lighting**: Glowing effects on active buttons
- **Responsive units**: Works across different screen sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
├── app/
│   ├── components/          # React components
│   ├── api/                 # API routes
│   ├── providers/           # Context providers
│   ├── page.tsx             # Main game page
│   └── page.module.css      # Game styles
├── contracts/               # Solidity smart contracts
├── scripts/                 # Deployment scripts
├── public/                  # Static assets
└── hardhat.config.js       # Hardhat configuration
```

## 🌐 Base Mini App Configuration

Update `farcaster.config.ts` with your app's metadata:

```typescript
export const farcasterConfig = {
  miniapp: {
    name: "Memory Trainer",
    subtitle: "Retro Memory Game with Web3 Leaderboard",
    description: "Classic memory training game with retro electronic design",
    primaryCategory: "game",
    tags: ["memory", "game", "retro", "web3", "base", "leaderboard"],
    // ... other configuration
  }
} as const;
```

## 🎯 Next Steps

1. **Deploy to Production**: Use Vercel, Netlify, or similar
2. **Configure Base Mini App**: Update metadata and submit to Base
3. **Test Web3 Integration**: Ensure wallet connection works
4. **Optimize Performance**: Minimize bundle size and loading times
5. **Add Analytics**: Track user engagement and game statistics

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For issues and questions:
- Check the Base Mini App documentation
- Review the smart contract code
- Test with different wallets and networks
- Ensure proper environment configuration