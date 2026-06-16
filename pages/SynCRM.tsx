import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  LayoutDashboard,
  Users,
  Eye,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { CTAButton, GhostLink, Eyebrow, SectionHeader, ProofPlaceholder } from '../components/site/Primitives';

/**
 * SynCRM — the flagship product page.
 * Narrative arc: the world today → the quiet problem → what it costs →
 * the shift → how it works → who it's for → proof → CTA.
 */
export const SynCRM: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const steps = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'A lead messages on WhatsApp',
      desc: 'Every enquiry — WhatsApp, web form, portal, walk-in — lands in one place automatically. Nothing lives in a personal phone anymore.',
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: 'It gets captured and routed',
      desc: 'The lead is logged, qualified, and assigned to an agent the moment it arrives — with the full conversation attached, not a sticky note.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Agents work it in the open',
      desc: 'Calls, viewings, offers and follow-ups all happen inside the system. Adoption is driven by the work itself — not by nagging your team to update a CRM.',
    },
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: 'You finally see the pipeline',
      desc: 'Every deal, stage, and idle lead on one board. The numbers are real because they come from the work, not from someone filling in a spreadsheet on Friday.',
    },
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      {/* ===== HERO: the quiet problem ===== */}
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="ambient-glow absolute top-[10%] right-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Eyebrow>SynCRM · Real Estate Operating System</Eyebrow>
          <h1 className="hero-heading mb-8 text-shimmer">
            Stop running your agency <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">blind.</span>
          </h1>
          <p className="sub-heading max-w-2xl mx-auto mb-12">
            Most agencies don't lose deals because their agents are bad. They lose deals because
            leads live in WhatsApp, follow-ups live in someone's head, and nobody can see the
            pipeline until it's already gone cold. SynCRM is the system that makes the whole
            operation visible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton label="Book a brokerage diagnostic" />
            <GhostLink to="/work" label="See what we've built" />
          </div>
        </div>
      </section>

      {/* ===== THE COST ===== */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow={<><Eye className="w-3 h-3" /> The cost of running blind</>}
            title={<>The leak you can't <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">see.</span></>}
            sub="When the operation lives in chat threads and spreadsheets, three things quietly happen — and none of them show up until the month is already lost."
          />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
            {[
              {
                t: 'Leads go cold',
                d: 'An enquiry sits unread in a personal WhatsApp for two days. By the time anyone replies, they’ve booked a viewing with someone else.',
              },
              {
                t: 'Nothing is followed up',
                d: 'The deals that need a second and third touch never get one, because no one is tracking who said they’d call back.',
              },
              {
                t: 'You can’t manage what you can’t see',
                d: 'You find out a deal died in the weekly meeting — too late to do anything about it. The pipeline is a guess.',
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card card-hover-glow rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5"
              >
                <h3 className="text-xl md:text-2xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">{c.t}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (folded from Real Estate) ===== */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <div className="ambient-glow absolute bottom-[5%] left-[5%] w-[40vw] h-[40vw] blur-[150px] bg-brand-green/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            eyebrow={<><Workflow className="w-3 h-3" /> How SynCRM works</>}
            title={<>The work drives <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">adoption.</span></>}
            sub="SynCRM isn't another tool your agents have to remember to update. The leads land in it, so the work happens in it — and the data takes care of itself."
          />
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-16">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5 flex gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-2">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-light mb-3 text-gray-900 dark:text-dark-text-primary">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR OWNERS / FOR AGENTS ===== */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              icon: <TrendingUp className="w-6 h-6" />,
              tag: 'For owners & principals',
              t: 'See the whole business at a glance',
              points: ['Every lead, deal and agent on one board', 'Know which deals are stalling before they die', 'Real numbers, because they come from real work'],
            },
            {
              icon: <Users className="w-6 h-6" />,
              tag: 'For agents',
              t: 'Less admin, more closing',
              points: ['Leads arrive with the full conversation attached', 'Follow-ups and reminders handled automatically', 'One place for calls, viewings and offers'],
            },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card rounded-[40px] p-8 md:p-12 border border-black/5 dark:border-white/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-8">
                {b.icon}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">{b.tag}</div>
              <h3 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-dark-text-primary">{b.t}</h3>
              <ul className="space-y-3">
                {b.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-dark-text-secondary">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PROOF (placeholders until verified) ===== */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="center"
            title={<>Agencies running on <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">SynCRM.</span></>}
            sub="Real results from real brokerages — added here as they're confirmed."
          />
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <ProofPlaceholder note="[CASE STUDY — Kev to supply] Brokerage name, the problem before SynCRM, and a verified outcome." />
            <ProofPlaceholder note="[PRODUCT UI — Kev to supply] Screenshot of the live pipeline board / WhatsApp capture." />
            <ProofPlaceholder note="[TESTIMONIAL — Kev to supply] A named principal or agent, quoted with permission." />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-24 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center relative overflow-hidden"
        >
          <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-green/10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="hero-heading mb-8 text-shimmer">See your pipeline clearly.</h3>
            <p className="sub-heading mb-12 max-w-2xl mx-auto">
              We start with a short diagnostic of how leads move through your agency today — and
              show you exactly where they're leaking. No packages, no pressure.
            </p>
            <CTAButton label="Book a brokerage diagnostic" />
            <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-400 dark:text-dark-text-tertiary font-bold">
              Also work in property? <Link to="/solutions/real-estate" className="underline hover:text-brand-orange">See our real-estate services</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
