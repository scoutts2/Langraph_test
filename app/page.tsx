'use client';

import { useState } from 'react';
import AgentInterface from '@/components/AgentInterface';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🤖 Personal Assistant Agent
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Experience a true AI agent with planning, tools, and contextual memory
        </p>
        <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">Agent Capabilities:</h3>
          <ul className="text-purple-700 text-sm space-y-1">
            <li>• <strong>Planning:</strong> Breaks down complex tasks into steps</li>
            <li>• <strong>Research:</strong> Gathers information on any topic</li>
            <li>• <strong>Decision Making:</strong> Helps you choose between options</li>
            <li>• <strong>Memory:</strong> Remembers our conversation context</li>
            <li>• <strong>Clarification:</strong> Asks questions when needed</li>
          </ul>
        </div>
      </header>
      
      <AgentInterface />
      
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Built with Next.js, LangGraph, and OpenAI</p>
        <p className="mt-2">
          <a 
            href="https://github.com/langchain-ai/langgraph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Learn more about LangGraph
          </a>
        </p>
      </footer>
    </div>
  );
}
