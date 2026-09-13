import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Archive, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface IntroOnboardingProps {
  onComplete: () => void;
  forceOpen?: boolean;
}

export const IntroOnboarding: React.FC<IntroOnboardingProps> = ({ onComplete, forceOpen = false }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = step === 1 ? 6000 : 9000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (step === 1) {
            setStep(2);
            return 0;
          } else {
            handleFinish();
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [step]);

  const handleFinish = () => {
    localStorage.setItem('aarambh_intro_seen_sih2026', 'true');
    onComplete();
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setProgress(0);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden select-none">
      {/* Subtle Indian Architectural / Heritage Background Accent */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header bar with Skip */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400/80 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Smart India Hackathon 2026 Prototype
        </div>
        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-100 bg-stone-900/60 hover:bg-stone-800 rounded-full border border-stone-800 transition-colors"
        >
          Skip Intro <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Preserving India's Cultural DNA
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-amber-50 font-heritage mb-4">
              AARAMBH
            </h1>
            <p className="text-xl sm:text-2xl text-amber-200/90 font-light tracking-wide mb-6">
              India's Living Memory Layer
            </p>

            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

            <p className="text-base sm:text-lg text-stone-300 max-w-lg mx-auto font-light leading-relaxed mb-8">
              Every street, temple, artisan chawk, and ancient stone in India holds an unwritten memory.
              Discover what a place remembers — before it disappears.
            </p>

            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/80 max-w-md mx-auto mb-10 text-xs text-stone-400">
              <span className="text-amber-400 font-semibold block mb-0.5">SIH 2026 — Team Aarambh</span>
              Heritage, Culture & Universal Living Memory Architecture
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-900/30"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 max-w-4xl mx-auto px-6"
          >
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-amber-400/90 font-semibold">
                Strategic Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-heritage mt-1">
                Beyond Tourism: A Cultural Memory Network
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* SCOPE */}
              <div className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Scope
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Aarambh connects India's places, people, stories, crafts, food, languages, and living traditions into one discoverable, location-grounded cultural layer.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-800/80 text-[11px] text-amber-400/70">
                  Universal Geocoding + Cultural Graph
                </div>
              </div>

              {/* FUTURE IMPLEMENTATION */}
              <div className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                    <Archive className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-orange-300 mb-2">
                    Future Implementation
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    From AI-assisted historical reconstruction to a nationwide participatory cultural archive, Aarambh continuously grows as citizens, creators, and curators contribute and verify memories.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-800/80 text-[11px] text-orange-400/70">
                  Participatory Living Heritage
                </div>
              </div>

              {/* USP */}
              <div className="p-6 rounded-2xl bg-stone-900/70 border border-amber-900/40 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Our USP
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Unlike a conventional tourism platform, Aarambh doesn't only tell you where to go. It helps you discover what a place remembers — and preserve what might disappear.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-800/80 text-[11px] text-amber-400/90 font-medium">
                  Preserve What Might Disappear
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-stone-400">
                Auto-entering Aarambh experience shortly...
              </div>
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-xl shadow-amber-900/20 cursor-pointer"
              >
                GO TO AARAMBH <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
