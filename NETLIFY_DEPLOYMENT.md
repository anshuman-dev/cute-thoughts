# Netlify Deployment Guide for Cute Thoughts

## Quick Deploy

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select this repository
   - Netlify will auto-detect the `netlify.toml` configuration

## Configuration Details

The `netlify.toml` file is already configured with:
- **Build command**: `npm run build:client` (builds only the frontend)
- **Publish directory**: `dist/public` (where Vite outputs the built files)
- **SPA redirects**: All routes redirect to `index.html` for client-side routing

## Environment Variables (Optional)

If you want to add custom RPC endpoints or WalletConnect project ID:

1. In Netlify dashboard → Site settings → Environment variables
2. Add:
   - `VITE_BASE_RPC_URL` (optional - defaults to Base mainnet)
   - `VITE_WALLETCONNECT_PROJECT_ID` (optional - for WalletConnect)

## Build Status

✅ Frontend builds successfully with no errors
✅ All Web3 functionality works client-side
✅ Smart contract is deployed on Base mainnet
✅ No server required for basic functionality

## Notes

- This deploys as a **static site** (frontend only)
- The backend API endpoints won't be available on Netlify
- All Web3 interactions work directly with the Base blockchain
- Social sharing and stats work without the backend

## Custom Domain (Optional)

After deployment, you can add a custom domain in:
Netlify Dashboard → Domain management → Add custom domain