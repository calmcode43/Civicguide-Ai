// =============================================================================
// CivicGuide AI — TypeScript Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Chat & Messaging
// -----------------------------------------------------------------------------

/** Represents a single message in a chat conversation. */
export interface Message {
  /** Unique identifier for the message (UUID v4). */
  id: string;
  /** Who authored the message. */
  role: 'user' | 'assistant';
  /** Markdown-formatted message content. */
  content: string;
  /** When the message was created. */
  timestamp: Date;
  /** True while the assistant is streaming a response. */
  isStreaming?: boolean;
  /** Follow-up questions suggested by the AI. */
  suggestions?: string[];
  /** Error message if the request failed (e.g., 429 Rate Limit). */
  error?: string;
}

/** Represents a complete chat session with its full message history. */
export interface ChatSession {
  /** Unique session identifier (UUID v4). */
  id: string;
  /** All messages in this session, ordered chronologically. */
  messages: Message[];
  /** Optional context about the user (e.g., state, country) for personalised answers. */
  userContext: string;
  /** When this session was first created. */
  createdAt: Date;
  /** Optional title for the session (e.g., first few words of first message). */
  title?: string;
}

// -----------------------------------------------------------------------------
// Election & Civic Data
// -----------------------------------------------------------------------------

/** Represents a single phase/step in the election process. */
export interface ElectionStep {
  /** Unique step identifier. */
  id: string;
  /** High-level phase name (e.g., "Registration", "Voting Day"). */
  phase: string;
  /** Human-readable step title. */
  title: string;
  /** Detailed description of what happens in this step. */
  description: string;
  /** Typical duration or deadline information. */
  duration: string;
  /** Numeric ordering within the full election timeline. */
  order: number;
  /** Detailed sub-steps or requirements. */
  details: string[];
}

/** Represents a logical group of election steps. */
export interface ElectionPhase {
  id: string;
  name: string;
  color: string;
  steps: ElectionStep[];
}

/** Complete response from the timeline API. */
export interface ElectionTimelineResponse {
  phases: ElectionPhase[];
  total_steps: number;
}

// -----------------------------------------------------------------------------
// API Communication
// -----------------------------------------------------------------------------

/** Generic wrapper for all API responses from the CivicGuide backend. */
export interface ApiResponse<T> {
  /** The actual payload returned by the API. */
  data: T;
  /** HTTP-level status string (e.g., "success", "error"). */
  status: string;
  /** Human-readable error message, present only on failure. */
  error?: string;
}

/** Represents a streamed chat response chunk from the backend. */
export interface StreamChunk {
  /** Partial content delta for the current stream. */
  delta: string;
  /** Whether this chunk is the final one in the stream. */
  done: boolean;
}

/** Payload sent to the backend when initiating a chat request. */
export interface ChatRequestPayload {
  /** The session ID to maintain conversation context. */
  sessionId: string;
  /** The user's question or message. */
  query: string;
  /** Optional geographic/demographic context for localised answers. */
  userContext?: string;
}

// -----------------------------------------------------------------------------
// UI State
// -----------------------------------------------------------------------------

/** Navigation link definition. */
export interface NavLink {
  label: string;
  href: string;
}

/** Toast notification data. */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
