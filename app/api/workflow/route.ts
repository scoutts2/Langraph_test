import { NextRequest, NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/langgraph-workflow';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();
    
    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const result = await runWorkflow(input);
    
    return NextResponse.json({
      success: true,
      result: {
        reasoning: result.reasoning,
        finalAnswer: result.finalAnswer,
        currentStep: result.currentStep,
      }
    });
  } catch (error) {
    console.error('Workflow error:', error);
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
    message: 'LangGraph Workflow API is running',
    endpoints: {
      POST: '/api/workflow - Run the LangGraph workflow with input'
    }
  });
}
