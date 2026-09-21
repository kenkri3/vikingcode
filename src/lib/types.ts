export type PlanTier = "TRIAL" | "STARTER" | "PRO" | "MESTER";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  plan: PlanTier;
  tokensRemaining: number;
  trialPromptsUsed: number;
  isActive: boolean;
  githubToken?: string | null;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  files: ProjectFile[];
  hasDatabase: boolean;
  githubRepo?: string | null;
  railwayId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentAction {
  id: string;
  type: "thought" | "analyze" | "search" | "code" | "system";
  title: string;
  content?: string;
  duration?: string;
  lineRange?: string;
  fileName?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: AgentAction[];
  filesCreated?: string[];
  timestamp: string;
  tokensUsed?: number;
}

export interface GenerateRequest {
  userId: string;
  projectId?: string;
  prompt: string;
  model?: string;
  currentFiles?: ProjectFile[];
}

export interface BotsifyWebhookPayload {
  action: "CODE_GENERATE" | "PUSH_GITHUB" | "EXPORT_LOCAL";
  user_id: string;
  project_name: string;
  estimated_tokens: number;
  requires_database: boolean;
  database_schema?: string;
  files: ProjectFile[];
}

export interface PlanConfig {
  name: string;
  displayName: string;
  tier: PlanTier;
  priceMonthly: number;
  tokensPerMonth: number;
  maxTrialPrompts?: number;
  features: string[];
  allowsZipExport: boolean;
  allowsGithubExport: boolean;
  allowsRailwayDeploy: boolean;
  hasPostgres: boolean;
}
