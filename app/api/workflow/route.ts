import { NextRequest, NextResponse } from 'next/server';
import { runAgent } from '@/lib/agent-workflow';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export async function POST(request: NextRequest) {
  try {
    const { input, conversationHistory } = await request.json();
    
    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // Convert conversation history to proper message format
    const messages = conversationHistory?.map((msg: any) => {
      if (msg.type === 'human') {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    }) || [];

    const result = await runAgent(input, messages);
    
    return NextResponse.json({
      success: true,
      result: {
        currentTask: result.currentTask,
        plan: result.plan,
        currentStep: result.currentStep,
        completedSteps: result.completedSteps,
        needsClarification: result.needsClarification,
        clarificationQuestion: result.clarificationQuestion,
        finalResult: result.finalResult,
        context: result.context,
      }
    });
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LangGraph Agent API is running',
    endpoints: {
      POST: '/api/workflow - Run the Personal Assistant Agent with input and conversation history'
    }
  });
}
