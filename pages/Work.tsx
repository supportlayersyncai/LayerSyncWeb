import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader, ProofPlaceholder } from '../components/site/Primitives';

/**
 * Work — proof. Intentionally placeholder-only until Kev supplies verified
 * case studies. We do not invent logos, metrics, or outcomes.
 */
export const Work: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const slots = [
    'SynCRM — a Zimbabwean brokerage. The pipeline problem, what we built, the verified result.',
    'An operations system for an SMB drowning in manual admin. Before / after, in real numbers.',
    'A custom web platform. The brief, the build, what it changed for the business.',
    'An AI agent handling first-line enquiries. What it replaced and what it freed up.',
    'An enterprise / multi-team deployment. Scope, security posture, outcome.',
    'Your project — the next one we add here.',
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      <section className="relative pt-40 md:pt-56 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <div className="ambient-glow absolute top-[10%] right-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Eyebrow><Briefcase className="w-3 h-3" /> Selected work</Eyebrow>
          <h1 className="hero-heading mb-8 text-shimmer">
            The systems we've <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">put into the world.</span>
          </h1>
          <p className="sub-heading max-w-2xl mx-auto">
            We'd rather show you one real system that changed how a business runs than a wall of
            logos. These case studies are being written up with the clients' permission — and only
            with numbers we can stand behind.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
            >
              <ProofPlaceholder note={`[CASE STUDY — Kev to supply] ${s}`} className="h-full flex flex-col justify-center min-h-[200px]" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-20 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center"
        >
          <h3 className="hero-heading mb-8 text-shimmer">Want to be the next one?</h3>
          <p className="sub-heading mb-12 max-w-2xl mx-auto">
            Start with a diagnostic. If we build something for you worth writing about, this is
            where it'll live.
          </p>
          <CTAButton />
        </motion.div>
      </section>
    </div>
  );
};
