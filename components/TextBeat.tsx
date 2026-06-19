
import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface TextBeatProps {
  title: string;
  subtitle: string;
  scrollYProgress: MotionValue<number>;
  range: [number, number];
  /** First beat: fully visible at scroll position 0 (no fade-in needed). */
  firstBeat?: boolean;
}

export const TextBeat: React.FC<TextBeatProps> = ({ title, subtitle, scrollYProgress, range, firstBeat = false }) => {
  const [start, end] = range;

  // The first beat must be on screen the instant the page loads, so it starts
  // at full opacity and only fades out as you scroll past it.
  const opacity = useTransform(
    scrollYProgress,
    firstBeat ? [start, end - 0.05, end] : [start, start + 0.05, end - 0.05, end],
    firstBeat ? [1, 1, 0] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    firstBeat ? [start, end - 0.05, end] : [start, start + 0.05, end - 0.05, end],
    firstBeat ? [0, 0, -40] : [40, 0, 0, -40]
  );

  const pointerEvents = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    ["auto", "auto", "auto", "none"]
  );

  const renderTitle = () => {
    const parts = title.split('*');
    return parts.map((part, i) => (
      i % 2 === 1
        ? <span key={i} className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">{part}</span>
        : <span key={i} className="text-gray-900 dark:text-dark-text-primary">{part}</span>
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

      <h2
        className="hero-heading mb-6 sm:mb-10 text-shimmer select-none cursor-default break-words max-w-[100vw] px-4"
        style={{ textShadow: '0 0 30px rgba(211, 97, 53, 0.15)' }}
      >
        {renderTitle()}
      </h2>

      <p className="sub-heading max-w-4xl leading-relaxed mx-auto px-4">
        {subtitle}
      </p>
    </motion.div>
  );
};
