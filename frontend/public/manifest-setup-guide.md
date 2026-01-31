# Manifest Setup Guide

## Steps to Complete Your Mini App Setup

1. **Deploy Your App**
   - Deploy your frontend to Vercel, Netlify, or your hosting provider
   - Get your production URL (e.g., `basereview.vercel.app`)

2. **Generate Account Association**
   - Visit: https://www.base.dev/preview?tab=account
   - Paste your domain in the "App URL" field
   - Click "Submit"
   - Click "Verify" and sign with your wallet
   - Copy the generated `header`, `payload`, and `signature`

3. **Update Manifest**
   - Edit `/public/.well-known/farcaster.json`
   - Paste the account association values
   - Update all URLs with your actual domain
   - Update hero images, screenshots, and icons

4. **Required Assets**
   - Icon: 1024×1024px PNG (transparent background discouraged)
   - Splash: 200×200px PNG
   - Hero: 1200×630px PNG/JPG (1.91:1 ratio)
   - Screenshots: 3× portrait 1284×2778px PNG/JPG
   - OG Image: 1200×630px PNG/JPG

5. **Generate Assets**
   - Use https://www.miniappassets.com/ to generate properly formatted images
   - Upload all assets to your hosting
   - Update URLs in manifest

6. **Verify Accessibility**
   - Ensure manifest is accessible at:
     `https://your-domain.com/.well-known/farcaster.json`
   - Check embed metadata on home page

7. **Trigger Indexing**
   - Share your Mini App URL in Base feed
   - Indexing starts automatically
   - Check search results after a few minutes

8. **Troubleshooting**
   - If not indexed, verify all required fields
   - Re-share URL to trigger reindex
   - Check manifest validation

For detailed instructions, see:
- https://docs.base.org/mini-apps/technical-guides/manifest
- https://docs.base.org/mini-apps/troubleshooting/how-search-works
