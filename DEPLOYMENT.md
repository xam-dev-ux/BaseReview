# BaseReview Deployment Guide

## Pre-Deployment Checklist

### 1. Smart Contract Deployment

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Base Mainnet
npm run deploy

# Verify on BaseScan
npm run verify -- --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_REVIEW_CONTRACT_ADDRESS=<deployed_contract_address>
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_CHAIN_ID=8453
VITE_BASE_EXPLORER=https://basescan.org
VITE_WEB3_STORAGE_TOKEN=<your_web3_storage_token>
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### 3. Generate Assets

Use https://www.miniappassets.com/ to generate:

1. **Icon** (1024×1024px PNG)
   - Save as `frontend/public/icon.png`
   - Transparent background discouraged

2. **Splash Screen** (200×200px PNG)
   - Save as `frontend/public/splash.png`
   - Simple, recognizable logo

3. **Hero Image** (1200×630px PNG/JPG, 1.91:1 ratio)
   - Save as `frontend/public/hero.png`
   - Used for embeds and OG image

4. **Screenshots** (3× portrait 1284×2778px)
   - Save as `frontend/public/screenshot1.png`, `screenshot2.png`, `screenshot3.png`
   - Show key features and UI

5. **OG Image** (1200×630px PNG/JPG)
   - Save as `frontend/public/og-image.png`
   - For social media sharing

### 4. Deploy Frontend

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

#### Option B: Netlify

```bash
# Build
cd frontend
npm run build

# Deploy dist folder to Netlify
```

#### Option C: Fleek (Decentralized)

```bash
# Install Fleek CLI
npm install -g @fleek-platform/cli

# Deploy
fleek sites deploy
```

### 5. Configure Manifest

1. **Get your deployed URL** (e.g., `basereview.vercel.app`)

2. **Generate Account Association**
   - Visit: https://www.base.dev/preview?tab=account
   - Paste your URL
   - Click "Submit" then "Verify"
   - Sign with your wallet
   - Copy `header`, `payload`, and `signature`

3. **Update manifest file** at `frontend/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "<paste_header_here>",
    "payload": "<paste_payload_here>",
    "signature": "<paste_signature_here>"
  },
  "miniapp": {
    "version": "1",
    "name": "BaseReview",
    "homeUrl": "https://your-actual-domain.com",
    "iconUrl": "https://your-actual-domain.com/icon.png",
    "splashImageUrl": "https://your-actual-domain.com/splash.png",
    "splashBackgroundColor": "#0052FF",
    "subtitle": "Community watchdog for Base apps",
    "description": "Protect yourself from scams with honest, decentralized reviews for Base MiniApps.",
    "screenshotUrls": [
      "https://your-actual-domain.com/screenshot1.png",
      "https://your-actual-domain.com/screenshot2.png",
      "https://your-actual-domain.com/screenshot3.png"
    ],
    "primaryCategory": "utility",
    "tags": ["security", "reviews", "community", "defi", "base"],
    "heroImageUrl": "https://your-actual-domain.com/hero.png",
    "tagline": "Don't Get Scammed. Check First.",
    "ogTitle": "BaseReview - Community Watchdog",
    "ogDescription": "Protect yourself from scams with honest reviews for Base MiniApps",
    "ogImageUrl": "https://your-actual-domain.com/og-image.png",
    "noindex": false
  }
}
```

4. **Redeploy** after updating manifest

### 6. Trigger Indexing

1. Share your Mini App URL in the Base feed
2. Indexing starts automatically
3. Wait a few minutes
4. Check search results

### 7. Verify Setup

✅ **Contract Verification**
- [ ] Contract deployed to Base Mainnet
- [ ] Contract verified on BaseScan
- [ ] Deployment info saved
- [ ] Frontend .env updated with contract address

✅ **Frontend Verification**
- [ ] All assets generated and uploaded
- [ ] Manifest file accessible at `/.well-known/farcaster.json`
- [ ] Embed metadata on home page
- [ ] All images load correctly
- [ ] Wallet connection works
- [ ] Contract interactions work

✅ **Mini App Verification**
- [ ] Account association complete
- [ ] All manifest URLs updated
- [ ] Manifest validated (no errors)
- [ ] App appears in Base search
- [ ] Embeds work when shared

## Post-Deployment

### Seed Initial Data

```bash
# Optional: Add demo apps and reviews
npm run seed-data
```

### Monitor Platform

- Set up monitoring for contract events
- Track gas costs and optimize if needed
- Monitor for security issues
- Gather user feedback

### Marketing

1. **Announce Launch**
   - Share on Base Discord
   - Tweet about it
   - Post in relevant communities

2. **Get Initial Reviews**
   - Invite trusted community members
   - Review popular Base apps
   - Build initial database

3. **Engage Community**
   - Respond to feedback
   - Fix bugs quickly
   - Add requested features

## Troubleshooting

### Manifest Not Indexing

1. Verify manifest is accessible:
   ```bash
   curl https://your-domain.com/.well-known/farcaster.json
   ```

2. Check all required fields are filled
3. Validate image URLs load correctly
4. Re-share URL to trigger reindex

### Contract Issues

1. Check contract is verified on BaseScan
2. Verify ABI matches deployed contract
3. Check RPC endpoint is correct
4. Ensure wallet is on Base Mainnet

### Frontend Issues

1. Check browser console for errors
2. Verify environment variables
3. Clear cache and rebuild
4. Test on different browsers

## Support

- **Technical Issues**: GitHub Issues
- **Community**: Discord
- **Security**: security@basereview.xyz

## Updates

To update the platform:

1. Deploy new contract version (if needed)
2. Update frontend code
3. Update manifest (if needed)
4. Redeploy frontend
5. Re-share URL to reindex

---

**Congratulations! Your BaseReview platform is now live! 🎉**

Help protect the Base community from scams by building a transparent, decentralized review platform.
