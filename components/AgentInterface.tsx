'use client';

import { useState } from 'react';

interface ConversationMessage {
  type: 'human' | 'ai';
  content: string;
  timestamp: Date;
}

interface AgentResult {
  currentTask: string;
  plan: string[];
  currentStep: number;
  completedSteps: string[];
  needsClarification: boolean;
  clarificationQuestion: string;
  finalResult: string;
  context: string;
}

export default function AgentInterface() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentAgentResult, setCurrentAgentResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    // Add user message to conversation
    const userMessage: ConversationMessage = {
      type: 'human',
      content: input,
      timestamp: new Date()
    };

    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);

    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input,
          conversationHistory: conversation.map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      const result = data.result;
      setCurrentAgentResult(result);

      // Add agent response to conversation
      const agentMessage: ConversationMessage = {
        type: 'ai',
        content: result.finalResult || result.clarificationQuestion || 'Processing...',
        timestamp: new Date()
      };

      setConversation([...updatedConversation, agentMessage]);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exampleTasks = [
    "Help me plan a weekend trip to San Francisco",
    "Research the best programming languages to learn in 2024",
    "I need to decide between buying a laptop or desktop computer",
    "Plan a healthy meal prep for the week",
    "Help me understand how to invest in stocks",
    "I want to learn a new skill but don't know what to choose"
  ];

  const clearConversation = () => {
    setConversation([]);
    setCurrentAgentResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Agent Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">🤖 Personal Assistant Agent</h3>
        <p className="text-purple-700 text-sm">
          I'm an AI agent that can plan, research, and help you make decisions. 
          I'll break down complex tasks into steps and execute them systematically.
        </p>
      </div>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Conversation History</h3>
            <button
              onClick={clearConversation}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.type === 'human'
                    ? 'bg-blue-50 border border-blue-200 ml-8'
                    : 'bg-green-50 border border-green-200 mr-8'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${
                    message.type === 'human' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {message.type === 'human' ? '👤 You' : '🤖 Agent'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
              What can I help you with?
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a task, ask for help with planning, research, or decision-making..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Agent is working...' : 'Ask the Agent'}
          </button>
        </div>
      </form>

      {/* Example Tasks */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Try these example tasks:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleTasks.map((task, index) => (
            <button
              key={index}
              onClick={() => setInput(task)}
              className="text-left p-3 text-sm bg-gray-50 hover:bg-purple-50 rounded border border-gray-200 hover:border-purple-200 text-gray-700 transition-colors"
              disabled={loading}
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Process Display */}
      {currentAgentResult && (
        <div className="space-y-4">
          {currentAgentResult.needsClarification && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-yellow-800 font-medium mb-2">🤔 Need More Information</h3>
              <p className="text-yellow-700">{currentAgentResult.clarificationQuestion}</p>
            </div>
          )}

          {currentAgentResult.plan.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-blue-800 font-medium mb-2">📋 Agent's Plan</h3>
              <ol className="text-blue-700 space-y-1">
                {currentAgentResult.plan.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span>{step}</span>
                    {index < currentAgentResult.currentStep - 1 && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {currentAgentResult.completedSteps.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-medium mb-2">✅ Completed Steps</h3>
              <div className="text-green-700 space-y-2 text-sm">
                {currentAgentResult.completedSteps.map((step, index) => (
                  <div key={index} className="p-2 bg-green-100 rounded">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAgentResult.finalResult && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="text-purple-800 font-medium mb-2">🎯 Final Result</h3>
              <div className="text-purple-700 whitespace-pre-wrap">
                {currentAgentResult.finalResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-md">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            <span className="text-purple-700">Agent is thinking and planning...</span>
          </div>
        </div>
      )}
    </div>
  );
}
