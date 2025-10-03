# 🤖 Personal Assistant Agent

A Next.js application featuring a true AI agent built with LangGraph, deployed on Vercel.

## Features

- **True AI Agent**: Complete agent with planning, tools, and decision-making
- **Multi-step Planning**: Breaks down complex tasks into actionable steps
- **Tool Integration**: Research, decision-making, and validation tools
- **Conversational Memory**: Maintains context across interactions
- **Conditional Logic**: Asks for clarification when needed

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

## Agent Architecture

The app demonstrates a true AI agent with advanced LangGraph capabilities:

```typescript
// Agent workflow with conditional logic and tools
Analyze Request → [Clarify if needed] → Create Plan → Execute Steps → Finalize Result
```

### Agent Components:

1. **Planning Tool**: Breaks down complex tasks into steps
2. **Research Tool**: Gathers information on any topic  
3. **Decision Tool**: Helps with choices and recommendations
4. **Validation Tool**: Checks if tasks are completed successfully
5. **Memory System**: Maintains conversation context
6. **Conditional Routing**: Asks for clarification when needed

## API Endpoints

- `GET /api/workflow` - Agent API status
- `POST /api/workflow` - Run the Personal Assistant Agent with conversation history

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
│   └── AgentInterface.tsx     # Agent conversation UI
├── lib/
│   └── agent-workflow.ts      # LangGraph agent implementation
└── package.json
```

## Getting Started with LangGraph Agents

This app demonstrates advanced LangGraph agent concepts:

1. **State Management**: Complex state with multiple data types
2. **Conditional Routing**: Dynamic decision-making based on context
3. **Tool Integration**: Multiple specialized tools for different tasks
4. **Conversational Memory**: Maintaining context across interactions
5. **Planning & Execution**: Breaking down tasks and executing steps
6. **Error Handling**: Graceful handling of edge cases

Perfect for learning how to build sophisticated AI agents that can plan, execute, and adapt!
