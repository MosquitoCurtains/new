#!/bin/bash
# Deploy to Main Script for Mosquito Curtains
# Merges dev to main for production deployment

set -e

echo "🚀 Deploying to production (main)..."

# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)

# Fetch latest
echo "📥 Fetching latest..."
git fetch origin

# Checkout main
echo "📍 Switching to main..."
git checkout main
git pull origin main

# Merge dev
echo "🔀 Merging dev into main..."
git merge origin/dev --no-ff -m "Deploy: Merge dev to main" || {
    echo "⚠️  Merge conflict. Please resolve manually."
    exit 1
}

# Build test
echo "🔨 Running final build test..."
npm run build || {
    echo "❌ Build failed! Do not push to production."
    git merge --abort 2>/dev/null || true
    git checkout "$ORIGINAL_BRANCH"
    exit 1
}

# Confirm deployment
echo ""
echo "⚠️  About to push to PRODUCTION (main)."
read -p "Continue? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Deployment cancelled."
    git checkout "$ORIGINAL_BRANCH"
    exit 0
fi

# Push to main
echo "📤 Pushing to main (production)..."
git push origin main

# Return to original branch
git checkout "$ORIGINAL_BRANCH"

echo "✅ Deployed to production!"
echo "🌐 Vercel will auto-deploy from main."
