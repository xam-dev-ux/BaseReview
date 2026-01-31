# BaseReview Setup Instructions

## Before Deployment

### 1. Update index.html

Edit `/frontend/index.html` and replace all `your-domain.com` with your actual domain:

```html
<!-- Find and replace these URLs: -->
<meta property="og:url" content="https://your-actual-domain.com" />
<meta property="og:image" content="https://your-actual-domain.com/og-image.png" />
<meta property="twitter:url" content="https://your-actual-domain.com" />
<meta property="twitter:image" content="https://your-actual-domain.com/og-image.png" />

<!-- Update fc:frame content with your domain -->
"imageUrl": "https://your-actual-domain.com/hero.png",
"url": "https://your-actual-domain.com",
"splashImageUrl": "https://your-actual-domain.com/splash.png",
```

### 2. Generate and Add Required Images

Place these files in `/frontend/public/`:

#### icon.png (1024×1024px)
- Your app icon
- PNG format
- Should be clear and recognizable

#### splash.png (200×200px)
- Loading screen logo
- PNG format
- Simple, clean design

#### hero.png (1200×630px, 1.91:1 ratio)
- Hero/embed image
- PNG or JPG
- Used when sharing links

#### og-image.png (1200×630px)
- Open Graph image
- PNG or JPG
- For social media previews

#### Screenshots (1284×2778px each)
- screenshot1.png
- screenshot2.png
- screenshot3.png
- Portrait orientation
- Show key features

**Generate all assets at:** https://www.miniappassets.com/

### 3. Update Manifest

Edit `/frontend/public/.well-known/farcaster.json`:

1. Deploy your app first to get the URL
2. Visit https://www.base.dev/preview?tab=account
3. Enter your domain and click "Verify"
4. Sign with your wallet
5. Copy the `header`, `payload`, and `signature`
6. Paste into the `accountAssociation` section
7. Update all URLs in the `miniapp` section with your actual domain

Example:
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjU4...",
    "payload": "eyJkb21haW46...",
    "signature": "WQlIsOX1jeDX..."
  },
  "miniapp": {
    "homeUrl": "https://your-actual-domain.com",
    "iconUrl": "https://your-actual-domain.com/icon.png",
    // ... update all URLs
  }
}
```

### 4. Deploy

```bash
# Build
npm run build

# Deploy to your hosting (Vercel/Netlify/etc)
vercel

# After deployment, verify:
# 1. Manifest accessible at: https://your-domain.com/.well-known/farcaster.json
# 2. All images load correctly
# 3. Meta tags show correct domain
```

### 5. Trigger Indexing

1. Share your Mini App URL in Base feed
2. Indexing starts automatically
3. Check search results after a few minutes

## Verification Checklist

- [ ] All images generated and uploaded
- [ ] index.html URLs updated
- [ ] Manifest accountAssociation filled
- [ ] Manifest all URLs updated
- [ ] App deployed
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] All images load (test each URL)
- [ ] Meta tags show correct info (view page source)
- [ ] App shared in Base feed
- [ ] App appears in Base search

## Troubleshooting

**Images not loading?**
- Verify files exist in `/public/`
- Check file names match exactly (case-sensitive)
- Test URLs directly in browser

**Manifest not found?**
- Check file path: `/public/.well-known/farcaster.json`
- Verify hosting serves `.well-known` directory
- Test: `curl https://your-domain.com/.well-known/farcaster.json`

**Not indexing?**
- Verify all required manifest fields filled
- Check account association is valid
- Re-share URL to trigger reindex

**Need Help?**
- Discord: discord.gg/basereview
- GitHub: github.com/basereview/issues
- Base Docs: docs.base.org/mini-apps
