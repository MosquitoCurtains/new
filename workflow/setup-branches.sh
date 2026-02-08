#!/bin/bash
# Setup Branches Script for Mosquito Curtains
# Creates the dev, JVMacbookPro, and DBMacbookAir branches

set -e

echo "🔧 Setting up branch structure for Mosquito Curtains..."

# Ensure we're on main and up to date
echo "📍 Ensuring main is up to date..."
git checkout main
git pull origin main

# Create dev branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/dev; then
    echo "📦 Creating dev branch..."
    git checkout -b dev
    git push -u origin dev
else
    echo "✓ dev branch already exists"
fi

# Create JVMacbookPro branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/JVMacbookPro; then
    echo "📦 Creating JVMacbookPro branch..."
    git checkout main
    git checkout -b JVMacbookPro
    git push -u origin JVMacbookPro
else
    echo "✓ JVMacbookPro branch already exists"
fi

# Create DBMacbookAir branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/DBMacbookAir; then
    echo "📦 Creating DBMacbookAir branch..."
    git checkout main
    git checkout -b DBMacbookAir
    git push -u origin DBMacbookAir
else
    echo "✓ DBMacbookAir branch already exists"
fi

# Switch to JVMacbookPro (primary work branch)
git checkout JVMacbookPro

echo ""
echo "✅ Branch structure created!"
echo ""
echo "Branches:"
echo "  - main (production)"
echo "  - dev (staging)"
echo "  - JVMacbookPro (Machine 1)"
echo "  - DBMacbookAir (Machine 2)"
echo ""
echo "You are now on: JVMacbookPro"
echo ""
echo "Next steps:"
echo "  1. Start working: ./workflow/start-work.sh"
echo "  2. Save work: ./workflow/save-work.sh"
echo "  3. Merge to dev: ./workflow/merge-to-dev.sh"
echo "  4. Deploy: ./workflow/deploy-to-main.sh"
