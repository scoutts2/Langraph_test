'use client';

import { useState } from 'react';

interface WorkflowResult {
  reasoning: string;
  finalAnswer: string;
  currentStep: string;
}

export default function WorkflowInterface() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "What are the benefits of renewable energy?",
    "How do I start a small business?",
    "Explain quantum computing in simple terms",
    "What's the best way to learn a new language?",
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Ask a question or provide input:
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Run LangGraph Workflow'}
        </button>
      </form>

      {/* Example Questions */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
              disabled={loading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-green-800 font-medium mb-2">Analysis & Reasoning:</h3>
            <div className="text-green-700 whitespace-pre-wrap text-sm">
              {result.reasoning}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-blue-800 font-medium mb-2">Final Answer:</h3>
            <div className="text-blue-700 whitespace-pre-wrap">
              {result.finalAnswer}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Workflow completed • Step: {result.currentStep}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Running LangGraph workflow...</span>
          </div>
        </div>
      )}
    </div>
  );
}
