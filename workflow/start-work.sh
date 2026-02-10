#!/bin/bash
# Start Work Script for Mosquito Curtains
# Syncs your branch with the latest changes

set -e

# Detect current branch
CURRENT_BRANCH=$(git branch --show-current)

# Valid work branches
VALID_BRANCHES=("JVMacbookPro" "DBMacbookAir")

# Check if on a valid work branch
if [[ ! " ${VALID_BRANCHES[@]} " =~ " ${CURRENT_BRANCH} " ]]; then
    echo "⚠️  You're on '$CURRENT_BRANCH'. Switch to your work branch first:"
    echo "   git checkout JVMacbookPro"
    echo "   git checkout DBMacbookAir"
    exit 1
fi

echo "🚀 Starting work on $CURRENT_BRANCH..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin "$CURRENT_BRANCH"

# Also pull from dev to stay in sync
echo "🔄 Syncing with dev..."
git fetch origin dev
git merge origin/dev --no-edit || {
    echo "⚠️  Merge conflicts detected. Please resolve them manually."
    exit 1
}

echo "✅ Ready to work on $CURRENT_BRANCH!"
echo ""
echo "When done, run: ./workflow/save-work.sh"
