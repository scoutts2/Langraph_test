'use client';

import { useState } from 'react';
import WorkflowInterface from '@/components/WorkflowInterface';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          LangGraph Demo App
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Experience multi-step reasoning with LangGraph workflows
        </p>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. <strong>Analyze:</strong> Breaks down your input</li>
            <li>2. <strong>Reason:</strong> Develops step-by-step thinking</li>
            <li>3. <strong>Answer:</strong> Provides a comprehensive response</li>
          </ol>
        </div>
      </header>
      
      <WorkflowInterface />
      
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
