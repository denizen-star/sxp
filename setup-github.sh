#!/bin/bash

# SXP GitHub Repository Setup Script
echo "🚀 Setting up SXP GitHub repository..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial SXP project setup

- Complete SXP application structure
- PersonaSelector, NavigationGuide, ScheduleViewer components
- Authentication module with full auth system
- Design system with all components
- Services for activity tracking, creative suggestions, export
- Ready for deployment to sxp.kervinapps.com"

# Create main branch
echo "🌿 Setting up main branch..."
git branch -M main

echo "✅ SXP Git repository ready!"
echo ""
echo "🔗 Next steps to create GitHub repository:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: sxp"
echo "3. Description: SXP - Social Experiment Application for professional networking"
echo "4. Make it private (recommended)"
echo "5. Don't initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""
echo "📤 Then run these commands:"
echo "git remote add origin https://github.com/YOUR_USERNAME/sxp.git"
echo "git push -u origin main"
echo ""
echo "🌐 After GitHub setup, you can deploy to sxp.kervinapps.com"
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
