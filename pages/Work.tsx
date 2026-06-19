import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader, ProofPlaceholder } from '../components/site/Primitives';
import { FloatingOrbs, Reveal } from '../components/site/Backgrounds';
import { DeviceShowcase, type ShowcaseItem } from '../components/site/DeviceShowcase';

/**
 * Work — gallery personality. Centerpiece is the device showcase (the laptop
 * carousel from the web-design page, reused here to show the range of things
 * we build). Verified case studies are placeholders until supplied.
 */
export const Work: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const showcase: ShowcaseItem[] = [
    { title: 'Energy dashboard', desc: 'Operations dashboard concept', image: '/portfolio-1.png', tag: 'Custom systems', fit: 'object-left-top' },
    { title: 'ROI calculator', desc: 'Interactive web tool concept', image: '/portfolio-2.png', tag: 'Web', fit: 'object-left-top' },
    { title: 'Customer portal', desc: 'Client-facing portal concept', image: '/portfolio-3.png', tag: 'Web', fit: 'object-center' },
    { title: 'AI virtual staging', desc: 'Real-estate marketing concept', image: '/ai-staging-after.png', tag: 'SynCRM', fit: 'object-center' },
  ];

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
      {/* ===== HERO + SHOWCASE ===== */}
      <section className="relative pt-36 md:pt-52 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <FloatingOrbs accent="orange" />
        <div className="max-w-5xl mx-auto relative z-10 text-center mb-14 md:mb-20">
          <Reveal>
            <Eyebrow><Briefcase className="w-3 h-3" /> Selected work</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero-heading mb-8 text-shimmer">
              The systems we've <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">put into the world.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sub-heading max-w-2xl mx-auto">
              We'd rather show you one real system that changed how a business runs than a wall of
              logos. Below: a few build concepts — verified case studies land here as we publish them.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={32} className="max-w-5xl mx-auto relative z-10">
          <DeviceShowcase items={showcase} isDarkMode={dark} />
        </Reveal>
      </section>

      {/* ===== CASE STUDY PLACEHOLDERS ===== */}
      <section className="pb-20 md:pb-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="center"
            title={<>Case studies, <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">in progress.</span></>}
            sub="Written up with the clients' permission — and only with numbers we can stand behind."
            className="mb-14"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((s, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <ProofPlaceholder note={`[CASE STUDY — Kev to supply] ${s}`} className="h-full flex flex-col justify-center min-h-[200px]" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-20 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center relative overflow-hidden"
        >
          <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-green/10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="hero-heading mb-8 text-shimmer">Want to be the next one?</h3>
            <p className="sub-heading mb-12 max-w-2xl mx-auto">
              Start with a diagnostic. If we build something for you worth writing about, this is
              where it'll live.
            </p>
            <CTAButton />
          </div>
        </motion.div>
      </section>
    </div>
  );
};
