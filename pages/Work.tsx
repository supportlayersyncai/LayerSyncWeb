import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { Briefcase, Check, ArrowRight } from 'lucide-react';
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

  // Real, shipped product screens lead. Design concepts are labelled as such.
  const showcase: ShowcaseItem[] = [
    { title: 'SynCRM — pipeline dashboard', desc: 'Live lead pipeline, win rate and lead scoring', image: '/syncrm-dashboard.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'SynCRM — agent performance', desc: 'Assigned, contacted, viewings and conversion by agent', image: '/syncrm-reports.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'SynCRM Copilot', desc: 'Ask about your pipeline and act on leads in plain language', image: '/syncrm-copilot.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'Energy dashboard', desc: 'Operations dashboard design', image: '/portfolio-1.webp', tag: 'Web', fit: 'object-left-top', badge: 'Concept' },
    { title: 'Customer portal', desc: 'Client-facing portal design', image: '/portfolio-3.webp', tag: 'Web', fit: 'object-center', badge: 'Concept' },
  ];

  const slots = [
    'A Zimbabwean brokerage running on SynCRM. The pipeline problem, what we built, the result — written up with their permission.',
    'An operations system for an SMB drowning in manual admin. Before / after, in real numbers.',
    'A custom web platform. The brief, the build, what it changed for the business.',
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
              logos. SynCRM is our flagship, and it's live today — these are its actual screens.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={32} className="max-w-5xl mx-auto relative z-10">
          <DeviceShowcase items={showcase} isDarkMode={dark} />
        </Reveal>
      </section>

      {/* ===== THE SYNCRM BUILD — real, verifiable scope ===== */}
      <section className="pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <article className="glass-card rounded-[32px] border border-black/5 dark:border-white/5 p-8 md:p-12">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-orange mb-4">Flagship build · Live</div>
              <h2 className="text-2xl md:text-4xl font-light mb-5 text-gray-900 dark:text-dark-text-primary">
                SynCRM — a real estate operating system
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-3xl mb-8">
                Built from the ground up for how agencies actually work: every enquiry captured in one
                place, routed to an agent, and worked through to close — with the whole pipeline
                visible to management for the first time. It's in production today.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  'Lead & contact management',
                  'Pipeline and Kanban deal tracking',
                  'AI lead scoring & property matching',
                  'Viewings, tasks and reminders',
                  'Property & owner records',
                  'Role-based access (admin / agent)',
                  'Performance dashboards & reporting',
                  'AI copilot over your own data',
                  'Document generation & e-signature',
                ].map((f, i) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-dark-text-secondary">
                    <Check className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
                    <span className="leading-snug">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
                <Link to="/syncrm" className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-orange inline-flex items-center gap-2 group">
                  Explore SynCRM <ArrowRight className="w-4 h-4 cta-arrow" />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ===== CASE STUDIES IN PROGRESS ===== */}
      <section className="pb-20 md:pb-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="center"
            title={<>Client case studies, <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">in progress.</span></>}
            sub="We publish these only with the client's permission, and only with numbers we can stand behind — so this section fills up slower than it could."
            className="mb-14"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {slots.map((s, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <ProofPlaceholder note={s} className="h-full flex flex-col justify-center min-h-[190px]" />
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
