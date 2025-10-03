# LangGraph Demo App

A Next.js application demonstrating LangGraph workflows with a beautiful UI, deployed on Vercel.

## Features

- **Multi-step Reasoning**: LangGraph workflow with three distinct steps:
  1. **Analyze**: Breaks down user input
  2. **Reason**: Develops step-by-step thinking
  3. **Answer**: Provides comprehensive response

- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **Real-time Processing**: Live workflow execution with loading states
- **Example Questions**: Pre-built examples to try the workflow

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial LangGraph demo app"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `OPENAI_API_KEY`
   - Deploy!

## LangGraph Workflow

The app demonstrates a simple but effective LangGraph workflow:

```typescript
// Three-step workflow
Analyze Input → Generate Reasoning → Provide Answer
```

Each step uses OpenAI's GPT model to process and enhance the information, creating a structured reasoning process that's transparent to the user.

## API Endpoints

- `GET /api/workflow` - API status
- `POST /api/workflow` - Run the LangGraph workflow

## Technologies Used

- **Next.js 14** - React framework with App Router
- **LangGraph** - Multi-agent workflow orchestration
- **OpenAI GPT** - Language model for reasoning
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Vercel** - Deployment platform

## Project Structure

```
├── app/
│   ├── api/workflow/     # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── WorkflowInterface.tsx  # Main UI component
├── lib/
│   └── langgraph-workflow.ts  # LangGraph workflow logic
└── package.json
```

## Getting Started with LangGraph

This app is a great introduction to LangGraph concepts:

1. **State Management**: How to define and manage workflow state
2. **Node Functions**: Creating processing steps
3. **Workflow Orchestration**: Connecting nodes with edges
4. **Real-world Usage**: Integrating with web applications

Perfect for learning how to build more complex AI workflows!
