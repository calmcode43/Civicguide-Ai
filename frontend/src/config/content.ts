/**
 * CivicGuide AI — Content Configuration
 * This file contains all static text, feature descriptions, and step-by-step
 * guides used across the landing page and other static views.
 * 
 * CRITICAL: Zero mock data. These are permanent app descriptors.
 */

// =============================================================================
// Hero Section
// =============================================================================

export const HERO_SUBTITLE = "Ask anything about voter registration, election timelines, ballots, and the complete democratic process — powered by Google Gemini.";

// =============================================================================
// Features Section
// =============================================================================

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  { 
    icon: "🗳️", 
    title: "Voter Registration Guide", 
    description: "Step-by-step walkthrough of how to register, eligibility requirements, and deadlines." 
  },
  { 
    icon: "📅", 
    title: "Election Timelines", 
    description: "Visual breakdown of primary, general, and runoff election schedules and key dates." 
  },
  { 
    icon: "🤖", 
    title: "AI-Powered Answers", 
    description: "Ask any election question in plain language and receive accurate, sourced answers instantly." 
  },
  { 
    icon: "📋", 
    title: "Ballot Explained", 
    description: "Understand what's on your ballot — measures, candidates, and how voting works." 
  },
  { 
    icon: "🏛️", 
    title: "Election Officials", 
    description: "Learn about the roles of election commissions, poll workers, and oversight bodies." 
  },
  { 
    icon: "✅", 
    title: "Post-Election Process", 
    description: "Understand vote counting, result certification, audits, and the transition of power." 
  }
];

// =============================================================================
// How It Works Section
// =============================================================================

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  { 
    step: "01", 
    title: "Ask Your Question", 
    description: "Type any election-related question in plain language" 
  },
  { 
    step: "02", 
    title: "AI Understands Context", 
    description: "Gemini analyzes your question and retrieves relevant election information" 
  },
  { 
    step: "03", 
    title: "Get Clear Answers", 
    description: "Receive sourced, accurate explanations with follow-up suggestions" 
  }
];
