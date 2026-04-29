import { motion } from 'framer-motion';
import { HeroCanvas, GlobeScene } from '@/components/three';
import SEO from '@/components/SEO';

const VALUES = [
  {
    title: "Non-Partisan Neutrality",
    description: "Our AI engine is rigorously instructed to remain neutral, providing factual information on election processes without political bias.",
    icon: "⚖️"
  },
  {
    title: "Real-Time Accuracy",
    description: "By integrating Google Custom Search, we augment our AI responses with the most current election dates, registration deadlines, and ballot measures.",
    icon: "📡"
  },
  {
    title: "Civic Accessibility",
    description: "We use 3D visualizations and plain-language AI to translate complex legislative procedures into actionable knowledge for all citizens.",
    icon: "🔓"
  }
];

export default function AboutPage() {
  return (
    <main className="relative bg-void min-h-screen pt-24 pb-20 overflow-hidden">
      <SEO 
        title="Our Mission"
        description="Learn about our mission to empower the electorate through unbiased, AI-driven election information and interactive civic technology."
        path="/about"
      />
      {/* Background Canvas */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <HeroCanvas />
      </div>

      <div className="relative z-10 content-width px-6">
        {/* Hero Section */}
        <header className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-display text-white mb-8">
              Empowering the <span className="gold-gradient-text">Electorate</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed font-body">
              CivicGuide AI was born from the belief that access to clear, accurate, and unbiased election information is a fundamental democratic right. In an era of complexity, we provide the clarity needed to participate with confidence.
            </p>
          </motion.div>
        </header>

        {/* Core Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-8 bg-abyss border border-border rounded-card hover:border-gold/30 transition-all group"
            >
              <span className="text-4xl block mb-6 group-hover:scale-110 transition-transform">{value.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </section>

        {/* The Project Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-display text-white mb-6">Built for the Google PromptWars</h2>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                CivicGuide AI is a showcase of next-generation civic technology, developed for the **Google PromptWars Hackathon 2024**. Our mission is to demonstrate how generative AI can be used responsibly to bridge the gap between complex election law and voter action.
              </p>
              <p>
                By leveraging **Google Gemini 1.5 Pro**, we've created an assistant that doesn't just answer questions—it understands the context of who is asking, whether you're a first-time voter, a returning citizen, or an election observer.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-abyss border border-gold/10 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-2xl shadow-gold/5"
          >
             {/* The Interactive 3D Component */}
             <div className="absolute inset-0 z-0">
               <GlobeScene />
             </div>

             {/* UI Overlay on top of 3D */}
             <div className="absolute bottom-8 left-8 right-8 z-10 text-center pointer-events-none">
                <div className="inline-block px-3 py-1 bg-void/60 backdrop-blur-md border border-gold/20 rounded-full">
                  <p className="text-gold font-medium uppercase tracking-[0.2em] text-[10px]">Interactive Civic Intelligence</p>
                </div>
             </div>
          </motion.div>
        </section>

        {/* Final Disclaimer */}
        <footer className="max-w-3xl mx-auto text-center py-12 border-t border-border">
          <h4 className="text-white font-semibold mb-4">Integrity & Accuracy</h4>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            While CivicGuide AI strives for 100% accuracy, election laws and deadlines can change rapidly. Our AI guidance is intended as a supporting tool. We always recommend cross-referencing with your local Board of Elections or official Secretary of State website.
          </p>
          <div className="flex items-center justify-center gap-6 grayscale opacity-50">
            <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">Official Data Sources Integrated</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
