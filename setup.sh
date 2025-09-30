#!/bin/bash

# SXP Setup Script
echo "🚀 Setting up SXP - Social Experiment Application..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating project structure..."
mkdir -p src/components src/services src/modules src/design-system src/store src/types

# Copy essential files if they don't exist
if [ ! -f "src/setupTests.ts" ]; then
    echo "// SXP Test Setup" > src/setupTests.ts
fi

echo "✅ SXP setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run 'npm start' to start the development server"
echo "2. Visit http://localhost:3000 to see SXP"
echo "3. Begin developing SXP modules"
echo ""
echo "📚 SXP Module Development:"
echo "- Authentication Module ✅ (Ready)"
echo "- User & Persona Management Module (To be developed)"
echo "- Matching & Recommendation Engine (To be developed)"
echo "- Event & Space Management Module (To be developed)"
echo "- Engagement Tracking & Analytics Module (To be developed)"
echo "- API Gateway & Security Module (To be developed)"
