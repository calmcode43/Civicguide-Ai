import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { GoldButton } from '@/components/ui';
import apiClient from '@/lib/apiClient';

// =============================================================================
// Constants & Types
// =============================================================================

interface BallotTerm {
  term: string;
  context: string;
  category: 'legal' | 'position' | 'procedure';
}


interface BallotSection {
  title: string;
  items: {
    label: string;
    description: string;
    terms: BallotTerm[];
  }[];
}

const SAMPLE_BALLOT_SECTIONS: BallotSection[] = [
  {
    title: 'Executive Branch',
    items: [
      { 
        label: 'President of the United States', 
        description: 'The highest executive officer of the nation.',
        terms: [{ term: 'Incumbent', category: 'position', context: 'The current holder of an office or post.' }] 
      },
    ]
  },
  {
    title: 'State Propositions',
    items: [
      { 
        label: 'Proposition 1A: Climate Resilience Bond', 
        description: 'Shall the state sell $10 billion in bonds for environmental protection?',
        terms: [
          { term: 'Bond Measure', category: 'legal', context: 'A request by a government to borrow money for specific projects.' },
          { term: 'Referendum', category: 'procedure', context: 'A direct vote by the electorate on a specific proposal.' }
        ] 
      },
    ]
  },
  {
    title: 'Local Measures',
    items: [
      { 
        label: 'Measure B: Zoning Amendment', 
        description: 'To allow for high-density housing near transit hubs.',
        terms: [
          { term: 'Amendment', category: 'legal', context: 'A formal change or addition to a legal document or constitution.' },
          { term: 'Zoning', category: 'procedure', context: 'Municipal laws that control how land can be used.' }
        ] 
      },
    ]
  }
];

// =============================================================================
// BallotDecoderPage
// =============================================================================

export default function BallotDecoderPage() {
  const [selectedTerm, setSelectedTerm] = useState<BallotTerm | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAiExplanation = useCallback(async (term: BallotTerm) => {
    setSelectedTerm(term);
    setIsLoading(true);
    setAiExplanation(null);

    try {
      const prompt = `Explain the term "${term.term}" in the context of a voting ballot. 
      The simple definition is: "${term.context}". 
      Provide a "Plain English" explanation in 2-3 sentences. 
      Include a "Why it matters" tip. Format with markdown bolding for key points.`;

      const response = await apiClient.post('/api/chat', {
        message: prompt,
        session_id: `decoder_${Date.now()}`,
        user_context: 'First-Time Voter'
      });

      if (response.data?.data?.reply) {
        setAiExplanation(response.data.data.reply);
      }
    } catch (err) {
      setAiExplanation("Sorry, I couldn't fetch an explanation right now. " + term.context);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-void pt-24 pb-20 px-6">
      <SEO 
        title="Ballot Decoder"
        description="Demystify your ballot with the interactive Ballot Decoder. Understand complex legal terms like 'Bond Measure', 'Referendum', and 'Incumbent' with AI-powered simplicity."
        path="/ballot-decoder"
      />

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: The Ballot Visualization */}
        <section className="order-2 lg:order-1">
          <header className="mb-8">
             <h1 className="text-3xl font-display font-bold text-white mb-2">The Interactive <span className="text-gold">Ballot</span></h1>
             <p className="text-text-secondary text-sm">Click on underlined terms to decode their meaning.</p>
          </header>

          <div className="bg-[#fdfcf0] rounded-sm shadow-2xl p-8 sm:p-12 text-void relative overflow-hidden">
            {/* Ballot Watermark */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center rotate-[-15deg]">
              <span className="text-9xl font-bold uppercase tracking-[1em]">OFFICIAL BALLOT</span>
            </div>

            <div className="relative z-10 border-[3px] border-void p-6 sm:p-8">
              <header className="border-b-4 border-void pb-4 mb-8 text-center">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-4">
                  <span>General Election</span>
                  <span>November 2026</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Official Sample Ballot</h2>
                <p className="text-[10px] font-bold mt-2">State of California | County of CivicGuide</p>
              </header>

              {SAMPLE_BALLOT_SECTIONS.map((section, sIdx) => (
                <div key={section.title} className="mb-10">
                  <h3 className="bg-void text-[#fdfcf0] text-xs font-black uppercase px-2 py-1 mb-6 tracking-widest inline-block">
                    {section.title}
                  </h3>
                  
                  {section.items.map((item) => (
                    <div key={item.label} className="mb-8 group">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-5 h-5 border-2 border-void flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-base font-black uppercase leading-tight mb-1">{item.label}</h4>
                          <p className="text-xs font-medium leading-relaxed opacity-80 mb-3">
                            {item.description}
                          </p>
                          
                          {/* Decorated Terms */}
                          <div className="flex flex-wrap gap-2">
                            {item.terms.map(t => (
                              <button
                                key={t.term}
                                onClick={() => fetchAiExplanation(t)}
                                aria-label={`Explain the term: ${t.term}`}
                                className={`text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                                  selectedTerm?.term === t.term 
                                    ? 'border-gold text-gold scale-105' 
                                    : 'border-void/20 hover:border-void'
                                }`}
                              >
                                ? {t.term}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sIdx < SAMPLE_BALLOT_SECTIONS.length - 1 && <div className="border-t border-void/10 my-8" />}
                </div>
              ))}

              <footer className="mt-12 pt-6 border-t-2 border-void text-[9px] font-bold text-center uppercase tracking-widest">
                End of Sample Ballot Sections
              </footer>
            </div>
          </div>
        </section>

        {/* Right: The AI Decoder Panel */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-28">
          <div className="bg-abyss/40 border border-border/40 rounded-3xl p-8 backdrop-blur-md shadow-xl">
            <AnimatePresence mode="wait">
              {!selectedTerm ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mx-auto mb-6 border border-gold/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Term Decoder</h3>
                  <p className="text-text-secondary text-sm max-w-xs mx-auto leading-relaxed">
                    Ever felt confused by legal jargon on a ballot? Select any term on the left to get a simple, AI-powered explanation.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedTerm.term}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <header>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 rounded-md bg-gold/10 border border-gold/20 text-[10px] font-bold text-gold uppercase tracking-widest">
                         {selectedTerm.category}
                       </span>
                       <span className="w-1 h-1 rounded-full bg-border" />
                       <span className="text-[10px] text-text-secondary uppercase tracking-widest">Civic Dictionary</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white">{selectedTerm.term}</h3>
                  </header>

                  <div className="bg-void/50 rounded-2xl p-6 border border-border/20 min-h-[160px] flex flex-col justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Decoding Jargon...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm">
                        <p className="text-text-primary leading-relaxed text-base italic mb-4">
                          "{selectedTerm.context}"
                        </p>
                        <div className="bg-gold/5 rounded-xl p-4 border border-gold/10 text-text-secondary text-sm leading-relaxed">
                          {aiExplanation}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <GoldButton variant="outline" size="sm" onClick={() => setSelectedTerm(null)}>
                      Clear Selection
                    </GoldButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-gold-gradient text-void shadow-gold-glow">
             <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">💡 Pro-Tip</h4>
             <p className="text-xs font-medium leading-relaxed opacity-90">
               "Bond Measures" usually require a higher threshold of votes (like 55% or 2/3) to pass compared to normal laws. Always check the required percentage!
             </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
