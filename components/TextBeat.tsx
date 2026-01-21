
import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface TextBeatProps {
  title: string;
  subtitle: string;
  scrollYProgress: MotionValue<number>;
  range: [number, number];
}

export const TextBeat: React.FC<TextBeatProps> = ({ title, subtitle, scrollYProgress, range }) => {
  const [start, end] = range;
  
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [40, 0, 0, -40]
  );

  const pointerEvents = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    ["none", "auto", "auto", "none"]
  );

  const renderTitle = () => {
    const parts = title.split('*');
    return parts.map((part, i) => (
      i % 2 === 1 
        ? <span key={i} className="italic font-extralight text-white/40">{part}</span> 
        : <span key={i}>{part}</span>
    ));
  };

  return (
    <motion.div 
      style={{ 
        opacity, 
        y, 
        pointerEvents: pointerEvents as any
      }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 sm:px-12 text-center"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mb-6 sm:mb-8 py-1.5 px-4 rounded-full border border-white/10 bg-white/5 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-medium text-white/30"
      >
        Real Estate Intelligence
      </motion.div>
      
      <h2 
        className="hero-heading mb-6 sm:mb-10 text-shimmer select-none cursor-default break-words max-w-[100vw] px-4"
        style={{ textShadow: '0 0 30px rgba(75, 107, 255, 0.15)' }}
      >
        {renderTitle()}
      </h2>
      
      <p className="sub-heading max-w-4xl leading-relaxed mx-auto px-4">
        {subtitle}
      </p>
    </motion.div>
  );
};
