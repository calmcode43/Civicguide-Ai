export type UserContext = 'First-Time Voter' | 'Returning Voter' | 'Candidate' | 'Observer';

export type StageContext =
  | 'Pre-Announcement'
  | 'Registration & Roll Check'
  | 'Campaign Period'
  | 'Polling Day'
  | 'Counting & Results';

export interface OfficialResource {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  isStreaming?: boolean;
  suggestions?: string[];
  error?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  userContext: UserContext;
  stageContext: StageContext;
  createdAt: Date | string;
  updatedAt?: Date | string;
  title?: string;
  messageCount?: number;
}

export interface SessionSummary {
  id: string;
  title: string;
  user_context: string;
  stage_context?: StageContext | null;
  language: 'en' | 'hi';
  message_count: number;
  updated_at: string;
}

export interface SessionDetailPayload {
  session: SessionSummary;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    language: 'en' | 'hi';
    timestamp: string;
    intent?: string | null;
  }>;
}

export interface SessionListPayload {
  sessions: SessionSummary[];
}

export interface ElectionStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  details: string[];
}

export interface ElectionPhase {
  id: string;
  name: string;
  color: string;
  steps: ElectionStep[];
}

export interface ElectionTimelineResponse {
  phases: ElectionPhase[];
  total_steps: number;
  sources?: OfficialResource[];
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  error?: string | null;
}

export interface ChatReplyPayload {
  session_id: string;
  reply: string;
  intent: string;
  suggestions: string[];
  sources: OfficialResource[];
}

export interface ChatStreamMetaEvent {
  type: 'meta';
  session_id: string;
  intent: string;
  suggestions: string[];
  sources: OfficialResource[];
  stage_context: StageContext;
  persona: string;
}

export interface ChatStreamChunkEvent {
  type: 'chunk';
  content: string;
}

export interface ChatStreamDoneEvent {
  type: 'done';
  reply: string;
  intent: string;
  suggestions: string[];
  sources: OfficialResource[];
  stage_context: StageContext;
  persona: string;
}

export type ChatStreamEvent = ChatStreamMetaEvent | ChatStreamChunkEvent | ChatStreamDoneEvent;

export interface SuggestionsPayload {
  persona: string;
  language: 'en' | 'hi';
  stage_context?: StageContext | null;
  suggestions: string[];
}

export interface BackendHealthPayload {
  service: string;
  version: string;
  environment: string;
  backend_ready: boolean;
  gemini_ready: boolean;
  translate_ready: boolean;
  firestore_mode: 'firestore' | 'memory';
  rate_limit_per_minute: number;
}

export interface TranslatePayload {
  translated_text: string;
  detected_source: string;
}

export interface FeedbackPayload {
  saved: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}
