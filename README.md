# BaseReview - Community Watchdog for Base MiniApps

![BaseReview Logo](https://img.shields.io/badge/Base-Review-0052FF?style=for-the-badge&logo=ethereum&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)

BaseReview is a decentralized reputation and review platform built on Base Mainnet specifically for auditing and reviewing MiniApps within the Base ecosystem. It serves as a community-driven watchdog to protect users from scam apps, highlight trustworthy projects, and create a transparent database of app reviews.

## 🌟 Features

### For Users
- **Browse & Search**: Discover Base MiniApps with advanced filtering
- **Read Reviews**: Access honest, immutable community reviews
- **Scam Protection**: Get warned about flagged and confirmed scam apps
- **Write Reviews**: Share your experience and help others
- **Reputation System**: Trusted reviewers have more weight
- **Vote on Reviews**: Mark helpful reviews to surface quality content

### For Developers
- **Register Your App**: Get listed on the platform
- **Respond to Reviews**: Address user feedback directly
- **Verify Your App**: Stake ETH to show legitimacy
- **Dispute False Reviews**: Community-driven dispute resolution
- **Build Trust**: Official verification for established projects

### Platform Features
- **100% On-Chain**: All reviews stored on Base blockchain
- **Gas Optimized**: Efficient contracts (~$0.10 per operation)
- **Anti-Spam**: Stake-based review system prevents abuse
- **Anti-Sybil**: Reputation-weighted voting system
- **Transparent**: All actions visible on-chain
- **Decentralized**: Community governance, not company-controlled

## 🏗️ Architecture

```
BaseReview/
├── contracts/              # Smart contracts
│   ├── BaseReview.sol     # Main review contract
│   └── libraries/
│       └── ReputationLib.sol
├── frontend/              # React + Vite app
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # App pages
│       ├── hooks/         # Custom hooks
│       ├── utils/         # Utilities
│       └── types/         # TypeScript types
├── scripts/               # Deployment scripts
├── test/                  # Smart contract tests
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BaseReview.git
cd BaseReview
```

2. **Install dependencies**
```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

3. **Configure environment**
```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

6. **Deploy to Base Testnet (Sepolia)**
```bash
npm run deploy:sepolia
```

7. **Start frontend**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 📝 Smart Contract

### BaseReview Contract

**Network**: Base Mainnet (Chain ID: 8453)
**Solidity Version**: 0.8.24
**License**: MIT

#### Key Functions

**App Registration**
```solidity
function registerMiniApp(
    string memory _name,
    string memory _url,
    Category _category,
    address[] memory _contractAddresses,
    string memory _metadataIPFS
) external returns (uint256 appId)
```

**Submit Review**
```solidity
function leaveReview(
    uint256 _appId,
    uint8 _rating,
    ReviewType _reviewType,
    uint8[] memory _tags,
    string memory _reviewIPFS,
    string memory _proofIPFS,
    bytes32[] memory _txHashes
) external payable returns (uint256 reviewId)
```

**Vote Helpful**
```solidity
function voteHelpful(uint256 _reviewId, bool _isHelpful) external
```

**Developer Response**
```solidity
function respondToReview(uint256 _reviewId, string memory _responseIPFS) external
```

### Gas Costs (Base Mainnet)

| Operation | Gas Used | Estimated Cost |
|-----------|----------|----------------|
| Register App | ~80,000 | ~$0.10 |
| Leave Review | ~70,000 | ~$0.08 |
| Vote Helpful | ~35,000 | ~$0.04 |
| Developer Response | ~40,000 | ~$0.05 |

## 🎨 Frontend

Built with:
- **Vite** - Lightning-fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Ethers.js v6** - Blockchain interaction
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Framer Motion** - Animations

### Key Pages

- **Home** (`/`) - Landing page with featured apps
- **Browse** (`/browse`) - Search and filter all apps
- **App Detail** (`/app/:id`) - Full app page with reviews
- **Write Review** - Submit a new review (modal/page)
- **Profile** - User stats and reputation
- **My Reviews** - Manage your reviews

## 📊 Reputation System

Reviewers earn reputation (0-100) based on:

- **Account Age** (20 pts max): Older wallets = higher trust
- **Activity** (20 pts max): More reviews = more weight
- **Helpful Reviews** (30 pts max): Quality over quantity
- **NFT Holdings** (10 pts): Verified collections add credibility
- **Consensus** (20 pts): Aligning with community
- **Penalties**: Lost disputes reduce score

### Reputation Tiers

| Score | Tier | Badge | Vote Weight |
|-------|------|-------|-------------|
| 0-20 | Newbie | 🌱 | 0.5x |
| 21-50 | Regular | ⭐ | 1x |
| 51-80 | Trusted | 💎 | 1.5x |
| 81-100 | Expert | 👑 | 2x |

## 🛡️ Scam Detection

Apps can be flagged through community reports:

1. **User submits scam report** with proof (screenshots, tx hashes)
2. **Report visible** immediately with "Under Review" status
3. **Community votes** on report validity
4. **Threshold reached** (5 verified reports) → App flagged as "Suspicious"
5. **Developer responds** with counter-evidence (7 day window)
6. **Community resolves** dispute through voting
7. **Confirmed scam** → App marked, developer stake slashed (if verified)

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

Test coverage includes:
- ✅ App registration
- ✅ Review submission & editing
- ✅ Helpful voting system
- ✅ Developer responses
- ✅ Dispute mechanisms
- ✅ Reputation calculations
- ✅ Scam flagging thresholds
- ✅ Access control
- ✅ Gas optimization

## 📦 Deployment

### Deploy to Base Mainnet

1. **Set up environment**
```bash
# Add to .env
PRIVATE_KEY=your_private_key
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_key
```

2. **Deploy contract**
```bash
npm run deploy
```

3. **Verify contract**
```bash
npm run verify -- --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

4. **Update frontend config**
```bash
# Add to frontend/.env
VITE_REVIEW_CONTRACT_ADDRESS=<deployed_address>
```

5. **Deploy frontend**
```bash
cd frontend
npm run build

# Deploy to Vercel, Fleek, or your preferred host
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [basereview.xyz](https://basereview.xyz) (coming soon)
- **Documentation**: [docs.basereview.xyz](https://docs.basereview.xyz)
- **Discord**: [discord.gg/basereview](https://discord.gg/basereview)
- **Twitter**: [@BaseReview](https://twitter.com/BaseReview)
- **Base Explorer**: [basescan.org](https://basescan.org)

## 🙏 Acknowledgments

- Built on [Base](https://base.org) - Coinbase's Layer 2
- Powered by [OpenZeppelin](https://openzeppelin.com) contracts
- UI inspired by the Base ecosystem

## ⚠️ Disclaimer

BaseReview is a community-driven platform. While we strive for accuracy, we cannot guarantee the authenticity of all reviews. Always do your own research (DYOR) before interacting with any MiniApp. The platform is not liable for any losses incurred from using reviewed applications.

---

**Built with ❤️ for the Base community**

*Don't Get Scammed. Check BaseReview First.*
