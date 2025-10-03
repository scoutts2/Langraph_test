import { StateGraph, END, START } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

// Define the agent state interface
interface AgentState {
  messages: BaseMessage[];
  currentTask: string;
  plan: string[];
  currentStep: number;
  completedSteps: string[];
  userPreferences: Record<string, any>;
  context: string;
  needsClarification: boolean;
  clarificationQuestion: string;
  finalResult: string;
}

// Initialize the LLM
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

// Tool functions that the agent can use
const tools = {
  // Planning tool - breaks down complex tasks
  async createPlan(task: string, context: string): Promise<string[]> {
    const prompt = `Given the task: "${task}" and context: "${context}", 
    create a step-by-step plan. Return only the steps as a numbered list, nothing else.`;
    
    const response = await model.invoke(prompt);
    const planText = response.content as string;
    
    // Parse the plan into steps
    const steps = planText
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(step => step.length > 0);
    
    return steps;
  },

  // Research tool - gathers information
  async researchTopic(topic: string): Promise<string> {
    const prompt = `Research and provide comprehensive information about: "${topic}". 
    Include key facts, important considerations, and practical advice.`;
    
    const response = await model.invoke(prompt);
    return response.content as string;
  },

  // Decision tool - helps with choices
  async makeDecision(options: string[], criteria: string): Promise<string> {
    const prompt = `Given these options: ${options.join(', ')} 
    and criteria: "${criteria}", provide a recommendation with reasoning.`;
    
    const response = await model.invoke(prompt);
    return response.content as string;
  },

  // Validation tool - checks if task is complete
  async validateCompletion(task: string, result: string): Promise<{complete: boolean, feedback: string}> {
    const prompt = `Has this task been completed successfully? 
    Task: "${task}"
    Result: "${result}"
    
    Respond with only "YES" or "NO" followed by brief feedback.`;
    
    const response = await model.invoke(prompt);
    const responseText = response.content as string;
    
    const isComplete = responseText.toLowerCase().includes('yes');
    const feedback = responseText.replace(/^(yes|no)\s*/i, '').trim();
    
    return { complete: isComplete, feedback };
  }
};

// Agent nodes
async function analyzeRequest(state: AgentState): Promise<Partial<AgentState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const userInput = lastMessage.content as string;
  
  const prompt = `Analyze this user request: "${userInput}"
  
  Determine:
  1. What type of task is this? (planning, research, decision, general)
  2. Is it clear and actionable?
  3. What additional information might be needed?
  
  Respond in format: TYPE: [type], CLEAR: [yes/no], NEEDS_INFO: [what info needed or "none"]`;
  
  const response = await model.invoke(prompt);
  const analysis = response.content as string;
  
  const needsInfo = analysis.includes('NEEDS_INFO:') && !analysis.includes('NEEDS_INFO: none');
  
  return {
    currentTask: userInput,
    needsClarification: needsInfo,
    clarificationQuestion: needsInfo ? 
      `I need more information to help you effectively. ${analysis.split('NEEDS_INFO:')[1]?.trim() || 'Could you provide more details?'}` : 
      "",
    context: analysis
  };
}

async function askForClarification(state: AgentState): Promise<Partial<AgentState>> {
  return {
    currentStep: 0,
    plan: [],
    completedSteps: []
  };
}

async function createPlan(state: AgentState): Promise<Partial<AgentState>> {
  if (state.needsClarification) {
    return { currentStep: 0, plan: [], completedSteps: [] };
  }
  
  const plan = await tools.createPlan(state.currentTask, state.context);
  
  return {
    plan,
    currentStep: 1,
    completedSteps: [],
    needsClarification: false
  };
}

async function executeStep(state: AgentState): Promise<Partial<AgentState>> {
  if (state.plan.length === 0) {
    return {
      finalResult: "No plan available to execute.",
      currentStep: state.currentStep + 1
    };
  }
  
  const currentStepIndex = state.currentStep - 1;
  const currentStepTask = state.plan[currentStepIndex];
  
  if (currentStepIndex >= state.plan.length) {
    // All steps completed, validate final result
    const validation = await tools.validateCompletion(
      state.currentTask, 
      state.completedSteps.join('\n')
    );
    
    return {
      finalResult: validation.feedback,
      currentStep: state.currentStep + 1
    };
  }
  
  // Determine which tool to use based on the step
  let stepResult = "";
  
  if (currentStepTask.toLowerCase().includes('research') || 
      currentStepTask.toLowerCase().includes('find') ||
      currentStepTask.toLowerCase().includes('information')) {
    stepResult = await tools.researchTopic(currentStepTask);
  } else if (currentStepTask.toLowerCase().includes('choose') ||
             currentStepTask.toLowerCase().includes('decide') ||
             currentStepTask.toLowerCase().includes('recommend')) {
    // For decision steps, we'll use a simple decision tool
    stepResult = await tools.makeDecision([currentStepTask], "user needs and preferences");
  } else {
    // General step execution
    const prompt = `Execute this step: "${currentStepTask}" 
    as part of the larger task: "${state.currentTask}".
    Provide a detailed response with actionable insights.`;
    
    const response = await model.invoke(prompt);
    stepResult = response.content as string;
  }
  
  const updatedCompletedSteps = [...state.completedSteps, `${currentStepIndex + 1}. ${currentStepTask}: ${stepResult}`];
  
  return {
    completedSteps: updatedCompletedSteps,
    currentStep: state.currentStep + 1
  };
}

async function finalizeResult(state: AgentState): Promise<Partial<AgentState>> {
  const prompt = `Based on the completed steps for the task: "${state.currentTask}"
  
  Steps completed:
  ${state.completedSteps.join('\n\n')}
  
  Provide a comprehensive final summary and recommendations.`;
  
  const response = await model.invoke(prompt);
  
  return {
    finalResult: response.content as string,
    currentStep: state.currentStep
  };
}

// Decision function for conditional routing
function shouldAskForClarification(state: AgentState): string {
  return state.needsClarification ? "clarify" : "plan";
}

function shouldContinueExecution(state: AgentState): string {
  if (state.currentStep <= state.plan.length) {
    return "execute";
  } else {
    return "finalize";
  }
}

// Create the agent workflow
export function createAgentWorkflow() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
      currentTask: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
      plan: {
        value: (x: string[], y: string[]) => y,
        default: () => [],
      },
      currentStep: {
        value: (x: number, y: number) => y,
        default: () => 0,
      },
      completedSteps: {
        value: (x: string[], y: string[]) => y,
        default: () => [],
      },
      userPreferences: {
        value: (x: Record<string, any>, y: Record<string, any>) => ({...x, ...y}),
        default: () => ({}),
      },
      context: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
      needsClarification: {
        value: (x: boolean, y: boolean) => y,
        default: () => false,
      },
      clarificationQuestion: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
      finalResult: {
        value: (x: string, y: string) => y,
        default: () => "",
      },
    },
  });

  // Add nodes
  workflow.addNode("analyze", analyzeRequest);
  workflow.addNode("clarify", askForClarification);
  workflow.addNode("plan", createPlan);
  workflow.addNode("execute", executeStep);
  workflow.addNode("finalize", finalizeResult);

  // Add conditional edges
  workflow.addConditionalEdges(
    "analyze",
    shouldAskForClarification,
    {
      "clarify": "clarify",
      "plan": "plan"
    }
  );

  workflow.addConditionalEdges(
    "execute",
    shouldContinueExecution,
    {
      "execute": "execute",
      "finalize": "finalize"
    }
  );

  // Add regular edges
  workflow.addEdge("clarify", END);
  workflow.addEdge("plan", "execute");
  workflow.addEdge("finalize", END);

  // Set entry point
  workflow.setEntryPoint("analyze");

  return workflow.compile();
}

// Helper function to run the agent
export async function runAgent(input: string, conversationHistory: BaseMessage[] = []): Promise<AgentState> {
  const workflow = createAgentWorkflow();
  
  const initialState: AgentState = {
    messages: [...conversationHistory, new HumanMessage(input)],
    currentTask: "",
    plan: [],
    currentStep: 0,
    completedSteps: [],
    userPreferences: {},
    context: "",
    needsClarification: false,
    clarificationQuestion: "",
    finalResult: "",
  };

  const result = await workflow.invoke(initialState);
  return result;
}
