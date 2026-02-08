#!/bin/bash
# Merge to Dev Script for Mosquito Curtains
# Merges work branches into dev for integration testing

set -e

echo "🔄 Merging work branches to dev..."

# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)

# Ensure we have latest
echo "📥 Fetching all branches..."
git fetch origin

# Checkout dev
echo "📍 Switching to dev..."
git checkout dev
git pull origin dev

# Merge JVMacbookPro if it exists
if git show-ref --verify --quiet refs/remotes/origin/JVMacbookPro; then
    echo "🔀 Merging JVMacbookPro..."
    git merge origin/JVMacbookPro --no-edit || {
        echo "⚠️  Merge conflict with JVMacbookPro. Please resolve manually."
        exit 1
    }
fi

# Merge DBMacbookAir if it exists
if git show-ref --verify --quiet refs/remotes/origin/DBMacbookAir; then
    echo "🔀 Merging DBMacbookAir..."
    git merge origin/DBMacbookAir --no-edit || {
        echo "⚠️  Merge conflict with DBMacbookAir. Please resolve manually."
        exit 1
    }
fi

# Build test
echo "🔨 Running build test..."
npm run build || {
    echo "❌ Build failed! Fix errors before pushing."
    exit 1
}

# Push dev
echo "📤 Pushing dev..."
git push origin dev

# Sync back to work branches
echo "🔄 Syncing dev back to work branches..."

for BRANCH in JVMacbookPro DBMacbookAir; do
    if git show-ref --verify --quiet refs/remotes/origin/$BRANCH; then
        echo "  → Syncing $BRANCH..."
        git checkout "$BRANCH"
        git merge dev --no-edit
        git push origin "$BRANCH"
    fi
done

# Return to original branch
git checkout "$ORIGINAL_BRANCH"

echo "✅ All branches merged to dev and synced!"
