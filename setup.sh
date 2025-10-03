#!/bin/bash

echo "🚀 Setting up LangGraph Demo App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    echo "   Or use a version manager like nvm: https://github.com/nvm-sh/nvm"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local - Please add your OpenAI API key!"
    echo "   Edit .env.local and add: OPENAI_API_KEY=your_key_here"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For deployment on Vercel:"
echo "1. Push to GitHub"
echo "2. Import the repository on Vercel"
echo "3. Add OPENAI_API_KEY environment variable"
echo "4. Deploy!"
