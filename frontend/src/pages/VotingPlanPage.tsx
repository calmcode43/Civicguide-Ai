import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { GoldButton } from '@/components/ui';
import apiClient from '@/lib/apiClient';
import ReactMarkdown from 'react-markdown';

// =============================================================================
// Constants & Types
// =============================================================================

interface PlanStep {
  id: string;
  title: string;
  question: string;
  options: { label: string; value: string; description: string }[];
}

const WIZARD_STEPS: PlanStep[] = [
  {
    id: 'registration',
    title: 'Registration Status',
    question: 'Are you currently registered to vote?',
    options: [
      { label: 'Yes, I am registered', value: 'registered', description: 'I am all set to vote in the upcoming election.' },
      { label: 'No, I need to register', value: 'not_registered', description: 'I want to know how and where to register.' },
      { label: 'I am not sure', value: 'unsure', description: 'Help me check my registration status.' },
    ],
  },
  {
    id: 'method',
    title: 'Voting Method',
    question: 'How do you plan to cast your ballot?',
    options: [
      { label: 'In-Person on Election Day', value: 'in_person', description: 'I will go to my local polling station on the day.' },
      { label: 'Early Voting', value: 'early', description: 'I want to vote before Election Day at an early voting site.' },
      { label: 'Mail-In / Absentee', value: 'mail', description: 'I want to vote from home using a mail-in ballot.' },
    ],
  },
  {
    id: 'location',
    title: 'Your Location',
    question: 'Which state or region will you be voting in?',
    options: [
      { label: 'California', value: 'California', description: 'West Coast voting rules.' },
      { label: 'Texas', value: 'Texas', description: 'Southern voting regulations.' },
      { label: 'New York', value: 'New York', description: 'East Coast voting procedures.' },
      { label: 'Other / International', value: 'Other', description: 'I am voting from elsewhere or abroad.' },
    ],
  },
];

// =============================================================================
// VotingPlanPage
// =============================================================================

export default function VotingPlanPage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStep = WIZARD_STEPS[currentStepIdx];
  const isLastStep = currentStepIdx === WIZARD_STEPS.length - 1;

  const handleSelect = (value: string) => {
    setSelections(prev => ({ ...prev, [currentStep.id]: value }));
    if (!isLastStep) {
      setTimeout(() => setCurrentStepIdx(prev => prev + 1), 300);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `Generate a personalized "My Voting Plan" checklist based on these details:
      - Registration Status: ${selections.registration}
      - Voting Method: ${selections.method}
      - State: ${selections.location}
      
      Provide a concise, professional markdown checklist including:
      1. Action items (e.g., "Check polling location at [link]")
      2. Key deadlines (Registration, Ballot request, Election Day)
      3. Required IDs/Documents
      4. A motivational closing sentence.
      Keep it structured with headers and bullet points.`;

      const response = await apiClient.post('/api/chat', {
        message: prompt,
        session_id: `plan_${Date.now()}`,
        user_context: 'General Voter'
      });

      if (response.data?.data?.reply) {
        setGeneratedPlan(response.data.data.reply);
      }
    } catch (err: any) {
      setError('Failed to generate your plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWizard = () => {
    setSelections({});
    setCurrentStepIdx(0);
    setGeneratedPlan(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-void pt-20 pb-20 px-6 overflow-x-hidden">
      <SEO 
        title="My Voting Plan"
        description="Create a personalized, AI-generated voting roadmap in 3 simple steps. Never miss a deadline or registration requirement again."
        path="/voting-plan"
      />

      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12 no-print">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Voter Roadmap Generator
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Build Your <span className="text-gold">Voting Plan</span>
          </h1>
          <p className="text-text-secondary max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Answer 3 quick questions to receive a personalized, AI-verified checklist for the upcoming election.
          </p>
        </header>

        {/* Wizard / Results Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-gold font-bold uppercase tracking-widest animate-pulse">Consulting Gemini AI...</p>
                <p className="text-text-secondary text-xs mt-2">Crafting your personalized checklist</p>
              </motion.div>
            ) : generatedPlan ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-abyss/40 border border-border/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Your Personalized Roadmap</h2>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="text-xs text-text-secondary hover:text-gold transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest no-print"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    Print
                  </button>
                </div>

                <div className="prose prose-invert prose-gold max-w-none prose-sm sm:prose-base">
                  <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                </div>

                <div className="mt-10 pt-8 border-t border-border/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
                   <p className="text-[10px] text-text-secondary/60 uppercase tracking-wider italic">
                     * This plan is AI-generated. Always double-check with official sources.
                   </p>
                   <GoldButton variant="outline" size="sm" onClick={resetWizard} className="no-print">
                     Start Over
                   </GoldButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${currentStep.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-abyss/40 border border-border/40 rounded-3xl p-6 sm:p-10 shadow-xl"
              >
                {/* Step indicator */}
                <div className="flex gap-2 mb-8">
                  {WIZARD_STEPS.map((s, idx) => (
                    <div 
                      key={s.id} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        idx <= currentStepIdx ? 'bg-gold' : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-2 block">
                  Step {currentStepIdx + 1} of {WIZARD_STEPS.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">{currentStep.question}</h2>

                <div className="grid gap-4">
                  {currentStep.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`group text-left p-5 rounded-2xl border transition-all duration-300 ${
                        selections[currentStep.id] === option.value
                          ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,160,23,0.15)]'
                          : 'bg-void/50 border-border/40 hover:border-gold/40 hover:bg-void'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm sm:text-base font-bold transition-colors ${
                          selections[currentStep.id] === option.value ? 'text-gold' : 'text-white'
                        }`}>
                          {option.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selections[currentStep.id] === option.value 
                            ? 'border-gold bg-gold' 
                            : 'border-border/40 group-hover:border-gold/40'
                        }`}>
                          {selections[currentStep.id] === option.value && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed opacity-80">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIdx === 0}
                    className={`text-xs font-bold uppercase tracking-widest transition-opacity ${
                      currentStepIdx === 0 ? 'opacity-0 pointer-events-none' : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    ← Back
                  </button>
                  
                  {isLastStep && selections[currentStep.id] && (
                    <GoldButton 
                      onClick={generatePlan}
                      className="px-8 shadow-gold-glow"
                    >
                      Generate My Plan →
                    </GoldButton>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-center text-danger text-xs font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
