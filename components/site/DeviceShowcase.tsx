import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ShowcaseItem {
  title: string;
  desc: string;
  image: string;
  tag?: string;
  fit?: string;
}

/**
 * Laptop-framed showcase carousel — the device component from the web-design
 * page, generalised so the Work page can showcase the range of things we build.
 * Auto-advances, pauses on hover, and is keyboard/arrow navigable.
 */
export const DeviceShowcase: React.FC<{ items: ShowcaseItem[]; isDarkMode: boolean }> = ({
  items,
  isDarkMode,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4200);
    return () => clearInterval(t);
  }, [paused, next]);

  const current = items[index];

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={prev}
          aria-label="Previous"
          className={`absolute left-0 z-30 p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
        >
          <ChevronLeft className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className={`absolute right-0 z-30 p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
        >
          <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
        </button>

        {/* Laptop frame */}
        <div className={`relative w-full max-w-4xl aspect-[16/10] rounded-[20px] md:rounded-[32px] p-2 md:p-4 shadow-2xl border transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-200 border-black/10'}`}>
          <div className="w-full h-full bg-black rounded-[16px] md:rounded-[20px] overflow-hidden relative group">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={current.image}
                alt={current.title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full h-full object-cover ${current.fit ?? 'object-center'}`}
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
              <div>
                {current.tag && (
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-orange">{current.tag}</span>
                )}
                <h3 className="text-lg md:text-2xl font-bold text-white mt-1">{current.title}</h3>
                <p className="text-gray-300 text-xs md:text-sm">{current.desc}</p>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-white/50 px-3 py-1.5 rounded-full border border-white/15">Concept</span>
            </div>
          </div>
          {/* Base */}
          <div className={`absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-3 md:h-4 rounded-b-[32px] shadow-xl transition-colors duration-500 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`} />
          <div className={`absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-[20%] h-1 rounded-b-[8px] transition-colors duration-500 ${isDarkMode ? 'bg-[#3a3a3a]' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2 mt-10">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-brand-orange' : `w-1.5 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}`}
          />
        ))}
      </div>
    </div>
  );
};
