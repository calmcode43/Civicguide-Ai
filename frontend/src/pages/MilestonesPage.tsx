import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { GoldButton } from '@/components/ui';

// =============================================================================
// Constants & Types
// =============================================================================

interface Milestone {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number; // 0 to 100
  date: string;
  description: string;
  icon: string;
}

const ELECTION_MILESTONES: Milestone[] = [
  {
    id: 'registration',
    label: 'Voter Registration',
    status: 'completed',
    progress: 100,
    date: 'Oct 15, 2026',
    description: 'The final window for online registration has closed.',
    icon: '📝',
  },
  {
    id: 'mail_in',
    label: 'Mail-in Voting',
    status: 'active',
    progress: 65,
    date: 'Starts in 4 Days',
    description: 'Ballots are being mailed to all registered voters.',
    icon: '✉️',
  },
  {
    id: 'early_voting',
    label: 'Early Voting Sites',
    status: 'upcoming',
    progress: 0,
    date: 'Nov 01, 2026',
    description: 'Find your nearest early voting center.',
    icon: '🏛️',
  },
  {
    id: 'election_day',
    label: 'General Election Day',
    status: 'upcoming',
    progress: 0,
    date: 'Nov 03, 2026',
    description: 'The final day to cast your ballot in person.',
    icon: '🗳️',
  },
];

// =============================================================================
// MilestonesPage
// =============================================================================

export default function MilestonesPage() {
  // 1. Target Date State (Default: Nov 3, 2026, 20:00:00)
  const [targetDate, setTargetDate] = useState(() => {
    try {
      const saved = localStorage.getItem('election_target_date');
      if (saved) {
        const d = new Date(saved);
        if (!isNaN(d.getTime())) return d;
      }
    } catch (e) {
      console.error('Failed to parse saved date', e);
    }
    return new Date('2026-11-03T20:00:00');
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // Safely initialize form strings using LOCAL time (not UTC)
  const getInitialForm = (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`
      };
    } catch {
      return { date: '2026-11-03', time: '20:00' };
    }
  };

  const [editForm, setEditForm] = useState(() => getInitialForm(targetDate));

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Update countdown logic to use targetDate
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSaveDate = () => {
    try {
      const [year, month, day] = editForm.date.split('-').map(Number);
      const [hour, minute] = editForm.time.split(':').map(Number);
      
      const newDate = new Date(year, month - 1, day, hour, minute, 0);
      
      if (!isNaN(newDate.getTime())) {
        setTargetDate(newDate);
        localStorage.setItem('election_target_date', newDate.toISOString());
        setIsEditing(false);
      } else {
        alert('Please enter a valid date and time.');
      }
    } catch (err) {
      console.error('Error saving date:', err);
      alert('Failed to save date. Please check your inputs.');
    }
  };

  return (
    <main className="min-h-screen bg-void pt-24 pb-20 px-6">
      <SEO 
        title="Election Milestones & Countdown"
        description="Stay ahead of the curve with our live election cycle dashboard. Track registration deadlines, mail-in voting windows, and the final countdown to Election Day."
        path="/milestones"
      />

      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Live Election Cycle Status
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                The Final <span className="text-gold">Countdown</span>
              </h1>
              <p className="text-text-secondary max-w-md">
                Tracking every major milestone of the 2026 General Election. Stay informed, stay ready.
              </p>
              
              <button 
                onClick={() => {
                  if (!isEditing) {
                    setEditForm(getInitialForm(targetDate));
                  }
                  setIsEditing(!isEditing);
                }}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {isEditing ? 'Cancel Editing' : 'Customize Date'}
              </button>
            </div>

            {/* Global Progress */}
            <div className="bg-abyss/40 border border-border/40 rounded-2xl p-5 backdrop-blur-md min-w-[280px]">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-3">
                 <span>Cycle Completion</span>
                 <span className="text-gold">72%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '72%' }}
                   transition={{ duration: 1, ease: 'easeOut' }}
                   className="h-full bg-gold shadow-[0_0_10px_rgba(212,160,23,0.5)]" 
                 />
               </div>
               <p className="text-[9px] text-text-secondary/60 mt-3 uppercase tracking-tighter">
                 Current Phase: <span className="text-white">Active Balloting</span>
               </p>
            </div>
          </div>

          {/* Edit Panel */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-8 overflow-hidden"
              >
                <div className="bg-void border border-gold/20 rounded-3xl p-6 flex flex-wrap items-end gap-6 shadow-2xl">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2">Target Date</label>
                    <input 
                      type="date" 
                      value={editForm.date}
                      onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-abyss border border-border/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2">Target Time</label>
                    <input 
                      type="time" 
                      value={editForm.time}
                      onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full bg-abyss border border-border/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <GoldButton onClick={handleSaveDate}>
                    Apply Changes
                  </GoldButton>
                  <button 
                    onClick={() => {
                      const official = new Date('2026-11-03T20:00:00');
                      setTargetDate(official);
                      setEditForm(getInitialForm(official));
                      localStorage.removeItem('election_target_date');
                      setIsEditing(false);
                    }}
                    className="px-4 py-3 rounded-xl border border-white/10 text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-white transition-all"
                  >
                    Reset to Official Date
                  </button>
                </div>
                
                {new Date(`${editForm.date}T${editForm.time}`).getTime() < new Date().getTime() && (
                  <p className="mt-3 text-[10px] text-danger font-bold uppercase tracking-widest animate-pulse">
                    ⚠️ Warning: The selected date is in the past. Countdown will show 0.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Big Countdown Timer */}
        <section className="mb-12">
          <div className="bg-void border border-gold/20 rounded-[2.5rem] p-10 sm:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gold-gradient opacity-[0.03] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <div className="text-5xl md:text-7xl font-display font-black text-white tabular-nums tracking-tighter mb-2">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gold/60">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Until Polls Close</h3>
              <p className="text-sm text-text-secondary">
                {targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {targetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </section>

        {/* Milestones Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ELECTION_MILESTONES.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border flex flex-col gap-5 h-full ${
                m.status === 'active' 
                  ? 'bg-gold/5 border-gold/30 ring-1 ring-gold/20 shadow-[0_10px_40px_rgba(212,160,23,0.1)]' 
                  : 'bg-abyss/40 border-border/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{m.icon}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  m.status === 'completed' ? 'bg-success/10 text-success' :
                  m.status === 'active' ? 'bg-gold text-void' : 'bg-white/5 text-text-secondary'
                }`}>
                  {m.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-lg mb-1">{m.label}</h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {m.description}
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{m.date}</span>
                  {m.status === 'active' && <span className="text-[10px] font-bold text-gold">{m.progress}%</span>}
                </div>
                {m.status === 'active' && (
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      className="h-full bg-gold"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Footer CTA */}
        <footer className="mt-16 text-center border-t border-border/40 pt-12">
           <h3 className="text-xl font-bold text-white mb-4">Need help with your specific timeline?</h3>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <GoldButton onClick={() => window.location.href='/assistant'}>
               Ask the AI Assistant
             </GoldButton>
             <GoldButton variant="outline" onClick={() => window.location.href='/voting-plan'}>
               Build My Plan
             </GoldButton>
           </div>
        </footer>

      </div>
    </main>
  );
}
