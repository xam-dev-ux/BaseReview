# Developer Guide - BaseReview

## For App Developers

### Registering Your App

#### 1. Prepare Metadata

Create a JSON file with your app information:

```json
{
  "name": "MyAwesomeApp",
  "description": "A revolutionary DeFi protocol on Base...",
  "logo": "https://myapp.com/logo.png",
  "screenshots": [
    "https://myapp.com/screenshot1.png",
    "https://myapp.com/screenshot2.png"
  ],
  "category": "DeFi",
  "website": "https://myapp.com",
  "twitter": "https://twitter.com/myawesomeapp",
  "discord": "https://discord.gg/myapp",
  "docs": "https://docs.myapp.com",
  "version": "1.0.0"
}
```

#### 2. Upload to IPFS

Use Web3.Storage, Pinata, or similar:

```javascript
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: YOUR_TOKEN });
const file = new File([JSON.stringify(metadata)], 'metadata.json');
const cid = await client.put([file]);

console.log('IPFS CID:', cid);
```

#### 3. Register on BaseReview

```javascript
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  BASEREVIEW_ADDRESS,
  BASEREVIEW_ABI,
  signer
);

const tx = await contract.registerMiniApp(
  "MyAwesomeApp",                    // name
  "https://myapp.com",               // url
  0,                                  // category (0 = DeFi)
  [YOUR_CONTRACT_ADDRESS],           // contract addresses
  cid                                 // IPFS metadata hash
);

await tx.wait();
console.log('App registered!');
```

### Responding to Reviews

```javascript
// Upload response to IPFS
const response = {
  response: "Thank you for your feedback! We've fixed the bug in v1.1..."
};
const responseCID = await uploadToIPFS(response);

// Submit response
const tx = await contract.respondToReview(
  reviewId,
  responseCID
);

await tx.wait();
```

### Disputing False Reviews

If a review is false or malicious:

```javascript
// Upload counter-evidence
const evidence = {
  explanation: "This review is false because...",
  proof: ["screenshot1.png", "screenshot2.png"],
  txHashes: ["0xabc...", "0xdef..."]
};
const evidenceCID = await uploadToIPFS(evidence);

// Submit dispute (requires bond)
const disputeBond = await contract.disputeBond(); // Get current bond amount

const tx = await contract.disputeReview(
  reviewId,
  evidenceCID,
  [txHash1, txHash2],
  { value: disputeBond }
);

await tx.wait();
```

**Note**: Community will vote on dispute. If you win, reviewer loses stake. If you lose, you lose bond.

### Getting Verified

#### Developer Verification

Show legitimacy by staking ETH:

```javascript
const verificationStake = await contract.verificationStake(); // 0.05 ETH

// Prepare verification proof
const proof = {
  team: ["John Doe - CEO", "Jane Smith - CTO"],
  audit: "https://audit-report.pdf",
  github: "https://github.com/myapp",
  linkedin: "https://linkedin.com/company/myapp"
};
const proofCID = await uploadToIPFS(proof);

// Submit verification
const tx = await contract.verifyApp(
  appId,
  proofCID,
  { value: verificationStake }
);

await tx.wait();
```

**Benefits**:
- Blue "Developer Verified" badge
- Higher user trust
- Demonstrates confidence in your project

**Risks**:
- If app later confirmed as scam, stake is slashed and distributed to reporters

#### Community Verification

Earned automatically when:
- >10 positive reviews from trusted users (reputation >50)
- Average rating >4 stars
- 0 scam reports

#### Official Verification

For well-established projects:
- Contact BaseReview DAO/governance
- Provide audit reports, team info, track record
- Requires vote from governance
- Highest trust level

### Handling Scam Reports

If your app receives scam reports:

#### 1. Don't Panic
- Scam reports don't immediately flag your app
- Need 5 verified reports to reach threshold
- You have 7 days to respond

#### 2. Respond Quickly
```javascript
// Address concerns in a developer response
const response = {
  response: "We've investigated this report. The issue was...",
  resolution: "We've implemented the following fixes...",
  proof: ["fix-screenshot.png", "updated-contract.pdf"]
};

await contract.respondToReview(reviewId, await uploadToIPFS(response));
```

#### 3. Fix Legitimate Issues
- If reports are valid, fix the issue
- Communicate transparently
- Provide compensation if applicable

#### 4. Dispute False Reports
- Gather counter-evidence
- File dispute with proof
- Engage with community respectfully

### Best Practices

#### Do's ✅
- ✅ Respond to all reviews (good and bad)
- ✅ Be transparent about issues
- ✅ Fix reported bugs quickly
- ✅ Keep metadata updated
- ✅ Engage with community respectfully
- ✅ Consider verification to build trust

#### Don'ts ❌
- ❌ Try to game the system with fake reviews
- ❌ Harass or attack reviewers
- ❌ Ignore legitimate concerns
- ❌ Make false claims in disputes
- ❌ Create multiple accounts to review your own app

### Integrating BaseReview

#### Embed Widget

Show your BaseReview rating on your site:

```html
<iframe
  src="https://basereview.xyz/widget?appId=123"
  width="300"
  height="100"
  frameborder="0"
></iframe>
```

#### API Access

Fetch your app's data:

```javascript
// Using ethers.js
const app = await contract.getApp(appId);
const reviews = await contract.getReviewsForApp(appId, 0, 10);

// Display on your site
console.log(`Rating: ${formatRating(app.averageRating)} stars`);
console.log(`Reviews: ${app.totalReviews}`);
```

### Monitoring

Set up alerts for:
- New reviews
- Scam reports
- Verification status changes
- Reputation changes

```javascript
// Listen for events
contract.on("ReviewSubmitted", (reviewId, appId, reviewer, rating) => {
  if (appId === YOUR_APP_ID) {
    console.log(`New review: ${rating} stars from ${reviewer}`);
    // Send notification to your team
  }
});

contract.on("ScamReportFiled", (reviewId, appId, reporter) => {
  if (appId === YOUR_APP_ID) {
    console.log(`⚠️ ALERT: Scam report filed!`);
    // Immediate notification
  }
});
```

## For Platform Developers

### Smart Contract Development

#### Setup
```bash
git clone https://github.com/yourusername/BaseReview.git
cd BaseReview
npm install
```

#### Testing
```bash
npm test                    # Run all tests
npm run test:coverage       # With coverage
REPORT_GAS=true npm test   # With gas reporting
```

#### Deployment
```bash
npm run deploy:sepolia      # Deploy to Base Sepolia testnet
npm run deploy              # Deploy to Base Mainnet
```

### Frontend Development

#### Setup
```bash
cd frontend
npm install
npm run dev
```

#### Build
```bash
npm run build     # Production build
npm run preview   # Preview build
```

#### Key Technologies
- **Vite**: Fast build tool
- **React 18**: UI framework
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Ethers.js**: Blockchain
- **React Query**: Data fetching
- **Zustand**: State management

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Security

Report security issues to: security@basereview.xyz

**Bug Bounty**: Up to $10,000 for critical vulnerabilities

---

*Build with integrity. Earn trust. Protect users.*
