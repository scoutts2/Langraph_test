import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

// Define the state interface
interface WorkflowState {
  messages: BaseMessage[];
  currentStep: string;
  reasoning: string;
  finalAnswer: string;
}

// Initialize the LLM
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

// Step 1: Analyze the input
async function analyzeInput(state: WorkflowState): Promise<Partial<WorkflowState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const analysisPrompt = `Analyze this input: "${lastMessage.content}". 
  Break down what the user is asking for and identify the key components.`;
  
  const response = await model.invoke(analysisPrompt);
  
  return {
    currentStep: "analysis",
    reasoning: response.content as string,
  };
}

// Step 2: Generate reasoning
async function generateReasoning(state: WorkflowState): Promise<Partial<WorkflowState>> {
  const reasoningPrompt = `Based on the analysis: "${state.reasoning}",
  provide detailed reasoning for how to approach this problem step by step.`;
  
  const response = await model.invoke(reasoningPrompt);
  
  return {
    currentStep: "reasoning",
    reasoning: state.reasoning + "\n\nReasoning: " + response.content,
  };
}

// Step 3: Provide final answer
async function provideAnswer(state: WorkflowState): Promise<Partial<WorkflowState>> {
  const answerPrompt = `Based on the analysis and reasoning provided: "${state.reasoning}",
  provide a comprehensive and helpful final answer to the user's question.`;
  
  const response = await model.invoke(answerPrompt);
  
  return {
    currentStep: "completed",
    finalAnswer: response.content as string,
  };
}

// Create the workflow
export function createWorkflow() {
  const workflow = new StateGraph<WorkflowState>({
    channels: {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
      currentStep: {
        value: (x: string, y: string) => y,
        default: () => "start",
      },
      reasoning: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
      finalAnswer: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
    },
  });

  // Add nodes
  workflow.addNode("analyze", analyzeInput);
  workflow.addNode("reason", generateReasoning);
  workflow.addNode("answer", provideAnswer);

  // Add edges
  workflow.addEdge("analyze", "reason");
  workflow.addEdge("reason", "answer");
  workflow.addEdge("answer", END);

  // Set entry point
  workflow.setEntryPoint("analyze");

  return workflow.compile();
}

// Helper function to run the workflow
export async function runWorkflow(input: string): Promise<WorkflowState> {
  const workflow = createWorkflow();
  const initialState: WorkflowState = {
    messages: [{ content: input, type: "human" } as BaseMessage],
    currentStep: "start",
    reasoning: "",
    finalAnswer: "",
  };

  const result = await workflow.invoke(initialState);
  return result;
}
