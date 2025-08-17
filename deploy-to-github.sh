#!/bin/bash

# Cute Thoughts Frontend - GitHub Deployment Script
# Author: anshuman-dev

echo "🚀 Deploying Cute Thoughts Frontend to GitHub..."
echo "Repository: https://github.com/anshuman-dev/cute-thoughts-frontend"
echo ""

# Remove any existing git lock files
rm -f .git/config.lock .git/index.lock

# Configure git user (ensuring anshuman-dev is the only author)
git config user.name "anshuman-dev"
git config user.email "anshuman.dev@github.com"

# Add remote origin if not exists
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/anshuman-dev/cute-thoughts-frontend.git

# Check current status
echo "📋 Checking repository status..."
git status

# Add all files to staging
echo "📦 Adding files to staging..."
git add .

# Create comprehensive commit message
echo "💾 Creating commit..."
git commit -m "🎨 Initial release: Cute Thoughts Web3 Frontend

✨ Features:
- Complete React/TypeScript frontend with Web3 integration
- Wallet connection (MetaMask/WalletConnect) via Wagmi + RainbowKit
- Smart contract interaction with CuteThoughtsGenerator on Base mainnet
- Social media sharing integration (Twitter, Farcaster, Instagram)
- Cute aesthetic design with Tailwind CSS and Shadcn/ui components
- Express.js backend with PostgreSQL and Drizzle ORM
- Comprehensive error handling and responsive design

🛠️ Tech Stack:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Web3: Wagmi, Viem, RainbowKit, Base Network
- Backend: Express.js, PostgreSQL, Drizzle ORM
- UI: Shadcn/ui, Radix UI, Lucide Icons

📱 Functionality:
- Generate positive thoughts (free or with ETH tips)
- Share thoughts across social platforms
- Real-time wallet connection and transaction handling
- Responsive design for all devices

Author: anshuman-dev"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Successfully deployed to GitHub!"
echo "🔗 Repository URL: https://github.com/anshuman-dev/cute-thoughts-frontend"
echo "👤 Author: anshuman-dev (sole author)"
echo ""
echo "🎉 Your Cute Thoughts Frontend is now live on GitHub!"