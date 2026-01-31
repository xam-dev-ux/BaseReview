# BaseReview - Quick Start Guide

Get your BaseReview platform running in under 10 minutes!

## 🚀 Fast Track

### 1. Install Dependencies (2 minutes)

```bash
# Root dependencies (contracts)
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Run Tests (1 minute)

```bash
# Ensure everything works
npm test
```

### 3. Start Development (1 minute)

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract locally
npm run deploy:local

# Terminal 3: Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` - Done! 🎉

## 🌐 Deploy to Base Mainnet

### Prerequisites
- Base RPC URL (get from [Base](https://base.org))
- Private key with ETH on Base
- BaseScan API key (get from [BaseScan](https://basescan.org))
- Web3.Storage token (get from [Web3.Storage](https://web3.storage))

### Step 1: Configure Environment

```bash
# Create .env files
cp .env.example .env
cp frontend/.env.example frontend/.env

# Edit .env - add your keys
# Edit frontend/.env - add configuration
```

### Step 2: Deploy Contract (3 minutes)

```bash
# Compile
npm run compile

# Deploy to Base Mainnet
npm run deploy

# Verify on BaseScan
npm run verify -- --network base <CONTRACT_ADDRESS> <ARGS>

# Update frontend/.env with contract address
```

### Step 3: Generate Assets (5 minutes)

Visit https://www.miniappassets.com/ and create:
- Icon (1024×1024px)
- Splash (200×200px)
- Hero (1200×630px)
- Screenshots (3× 1284×2778px)
- OG Image (1200×630px)

Save all to `frontend/public/`

### Step 4: Deploy Frontend (2 minutes)

```bash
cd frontend

# Build
npm run build

# Deploy to Vercel
vercel

# Or deploy to Netlify/Fleek
```

### Step 5: Configure Manifest (3 minutes)

1. Visit https://www.base.dev/preview?tab=account
2. Enter your domain, click "Verify"
3. Sign with wallet
4. Copy account association to `frontend/public/.well-known/farcaster.json`
5. Update all URLs in manifest
6. Redeploy frontend

### Step 6: Trigger Indexing (1 minute)

Share your URL in Base feed → automatic indexing!

## ✅ Verification Checklist

- [ ] Contract deployed and verified on BaseScan
- [ ] Frontend deployed and accessible
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] All assets load (icon, splash, hero, screenshots)
- [ ] Wallet connects successfully
- [ ] Can register an app
- [ ] Can submit a review
- [ ] Can vote on reviews
- [ ] App appears in Base search
- [ ] Embeds work when shared

## 🎯 What's Included

### Smart Contracts
- ✅ BaseReview.sol - Main contract (gas-optimized)
- ✅ ReputationLib.sol - Reputation calculations
- ✅ Comprehensive test suite (35+ tests)
- ✅ Deployment & verification scripts

### Frontend
- ✅ Professional UI with TailwindCSS
- ✅ Wallet connection (MetaMask compatible)
- ✅ Search & filtering
- ✅ App registration
- ✅ Review submission
- ✅ Helpful voting
- ✅ Scam detection
- ✅ Reputation system
- ✅ Developer responses
- ✅ Mobile responsive

### Base MiniApp Features
- ✅ Farcaster manifest
- ✅ Embed metadata
- ✅ Social sharing
- ✅ Search indexing
- ✅ Terms of Use & Disclaimer
- ✅ Professional UX

### Documentation
- ✅ README with full feature list
- ✅ User Guide (how to use platform)
- ✅ Developer Guide (integration & API)
- ✅ Deployment Guide (step-by-step)
- ✅ This Quick Start!

## 🛠️ Development Commands

```bash
# Smart Contracts
npm run compile          # Compile contracts
npm test                 # Run tests
npm run deploy           # Deploy to mainnet
npm run deploy:local     # Deploy locally
npm run verify           # Verify on BaseScan

# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Lint code
```

## 📚 Key Files

### Smart Contracts
- `contracts/BaseReview.sol` - Main contract
- `contracts/libraries/ReputationLib.sol` - Reputation logic
- `scripts/deploy.ts` - Deployment script
- `test/BaseReview.test.ts` - Tests

### Frontend
- `frontend/src/App.tsx` - Main app component
- `frontend/src/pages/` - All pages
- `frontend/src/components/` - Reusable components
- `frontend/src/hooks/` - Custom hooks
- `frontend/public/.well-known/farcaster.json` - Manifest

## 🐛 Troubleshooting

### Contract won't deploy
- Check you have enough ETH for gas
- Verify RPC URL is correct
- Try increasing gas limit

### Wallet won't connect
- Check network (must be Base Mainnet)
- Try different wallet provider
- Clear browser cache

### Manifest not indexing
- Verify accessible at `/.well-known/farcaster.json`
- Check all required fields filled
- Re-share URL to reindex

### Images not loading
- Check URLs in manifest are absolute
- Verify assets uploaded to hosting
- Test URLs in browser

## 💡 Pro Tips

1. **Start Local**: Test everything locally before deploying
2. **Use Testnet**: Deploy to Base Sepolia first
3. **Verify Contract**: Always verify on BaseScan
4. **Test Thoroughly**: Use different wallets/browsers
5. **Monitor Gas**: Optimize if costs too high
6. **Engage Community**: Get initial reviews from trusted users
7. **Iterate Fast**: Gather feedback and improve

## 🆘 Need Help?

- **Discord**: [discord.gg/basereview](https://discord.gg/basereview)
- **GitHub Issues**: [github.com/basereview/issues](https://github.com/basereview/issues)
- **Base Docs**: [docs.base.org](https://docs.base.org)
- **Email**: support@basereview.xyz

## 🎉 You're All Set!

Your BaseReview platform is ready to protect the Base community from scams!

**Next Steps:**
1. Share your platform in Base community
2. Get initial apps registered
3. Invite trusted reviewers
4. Monitor and improve

**Remember**: Quality reviews = trust = growth

---

*Built with ❤️ for the Base ecosystem*
