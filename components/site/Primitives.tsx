import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Shared building blocks for the rebranded site. Centralised here so every new
 * page (SynCRM, What We Build, Work, About, Contact) stays visually coherent
 * with the design tokens in docs/DESIGN-TOKENS.md.
 */

/** Primary call-to-action. Site-wide default points at the diagnostic form. */
export const CTAButton: React.FC<{
  to?: string;
  label?: string;
  className?: string;
}> = ({ to = '/contact', label = 'Book a diagnostic', className = '' }) => (
  <Link
    to={to}
    className={`btn-glow group px-10 md:px-14 py-4 md:py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center gap-3 bg-black text-white dark:bg-white dark:text-black ${className}`}
  >
    {label} <ArrowRight className="w-4 h-4 cta-arrow" />
  </Link>
);

/** Secondary / ghost link styled as a quiet pill. */
export const GhostLink: React.FC<{ to: string; label: string; className?: string }> = ({
  to,
  label,
  className = '',
}) => (
  <Link
    to={to}
    className={`group px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center gap-3 border border-black/10 dark:border-white/15 text-gray-700 dark:text-dark-text-secondary hover:border-black/30 dark:hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300 ${className}`}
  >
    {label} <ArrowRight className="w-4 h-4 cta-arrow" />
  </Link>
);

/** Uppercase eyebrow label used above section headings. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`inline-flex items-center gap-2 mb-8 py-2 px-6 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-dark-text-tertiary ${className}`}
  >
    {children}
  </div>
);

/**
 * Flagged placeholder for proof we have NOT verified yet. Per the audit, all
 * existing testimonials/metrics/logos are replaced with these until Kev
 * supplies real assets — so nothing fabricated ships.
 */
export const ProofPlaceholder: React.FC<{
  note: string;
  label?: string;
  className?: string;
}> = ({ note, label = 'In progress', className = '' }) => (
  <div
    className={`rounded-[24px] border border-dashed border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] p-6 md:p-8 text-center ${className}`}
  >
    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-orange mb-2">
      {label}
    </div>
    <p className="text-sm text-gray-500 dark:text-dark-text-tertiary leading-relaxed">{note}</p>
  </div>
);

/** Standard animated section header stack: eyebrow → heading → sub. */
export const SectionHeader: React.FC<{
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}> = ({ eyebrow, title, sub, align = 'left', className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}
  >
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="hero-heading mb-6">{title}</h2>
    {sub && <p className={`sub-heading ${align === 'center' ? 'mx-auto' : ''} max-w-2xl`}>{sub}</p>}
  </motion.div>
);
