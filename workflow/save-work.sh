#!/bin/bash
# Save Work Script for Mosquito Curtains
# Commits and pushes your changes

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

# Check for changes
if [[ -z $(git status --porcelain) ]]; then
    echo "✨ No changes to save."
    exit 0
fi

echo "💾 Saving work on $CURRENT_BRANCH..."

# Show what will be committed
echo "📝 Changes to commit:"
git status --short

# Get commit message
if [ -z "$1" ]; then
    echo ""
    read -p "Enter commit message (or press Enter for WIP): " MESSAGE
    MESSAGE=${MESSAGE:-"WIP: Work in progress"}
else
    MESSAGE="$1"
fi

# Add, commit, push
git add -A
git commit -m "$MESSAGE"
git push origin "$CURRENT_BRANCH"

echo "✅ Work saved and pushed to $CURRENT_BRANCH!"
