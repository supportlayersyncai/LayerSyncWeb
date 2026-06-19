import React from 'react';
import { motion } from 'framer-motion';

/**
 * Per-page background treatments. Each page composes a different one so the
 * site has visual variety rather than one uniform template. All are
 * pointer-events-none, sit behind content (z-0), and respect reduced-motion
 * via the CSS classes defined in index.html.
 */

type Accent = 'orange' | 'green';
const ACCENT = {
  orange: { a: 'rgba(211,97,53,0.20)', b: 'rgba(211,97,53,0.10)', solid: '#D36135' },
  green: { a: 'rgba(127,176,105,0.20)', b: 'rgba(127,176,105,0.10)', solid: '#7FB069' },
};

/** Animated aurora mesh — two drifting radial gradients. Calm, premium. */
export const Aurora: React.FC<{ accent?: Accent; className?: string }> = ({
  accent = 'orange',
  className = '',
}) => {
  const c = ACCENT[accent];
  const alt = accent === 'orange' ? ACCENT.green : ACCENT.orange;
  return (
    <div
      aria-hidden
      className={`absolute inset-0 z-0 pointer-events-none aurora-bg ${className}`}
      style={{
        backgroundImage: `radial-gradient(60% 60% at 20% 30%, ${c.a}, transparent 60%), radial-gradient(55% 55% at 80% 70%, ${alt.b}, transparent 60%)`,
      }}
    />
  );
};

/** Drifting blurred orbs. */
export const FloatingOrbs: React.FC<{ accent?: Accent }> = ({ accent = 'orange' }) => {
  const c = ACCENT[accent];
  const alt = accent === 'orange' ? ACCENT.green : ACCENT.orange;
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-[10%] -left-[5%] w-[45vw] h-[45vw] rounded-full blur-[140px] animate-drift"
        style={{ background: c.a }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[140px] animate-drift"
        style={{ background: alt.a, animationDelay: '6s' }}
      />
    </div>
  );
};

/** Moving blueprint grid — for the "What We Build" maker aesthetic. */
export const BlueprintGrid: React.FC<{ accent?: Accent }> = ({ accent = 'green' }) => {
  const c = ACCENT[accent];
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid text-black/[0.06] dark:text-white/[0.06]" />
      <div
        className="absolute top-1/4 left-1/3 w-[36vw] h-[36vw] rounded-full blur-[150px] animate-drift"
        style={{ background: c.a }}
      />
      {/* fade the grid toward the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_40%,transparent,#050505)] opacity-0 dark:opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_40%,transparent,#f5f5f7)] opacity-90 dark:opacity-0" />
    </div>
  );
};

/** Slowly rotating conic halo — sits behind a product visual. */
export const ConicHalo: React.FC<{ accent?: Accent; className?: string }> = ({
  accent = 'orange',
  className = '',
}) => {
  const c = ACCENT[accent];
  return (
    <div
      aria-hidden
      className={`absolute z-0 pointer-events-none animate-spin-slow blur-2xl opacity-40 ${className}`}
      style={{
        background: `conic-gradient(from 0deg, transparent, ${c.solid}, transparent 40%)`,
        borderRadius: '9999px',
      }}
    />
  );
};

/** Reveal-on-scroll wrapper to keep motion consistent across pages. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, y = 24, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
