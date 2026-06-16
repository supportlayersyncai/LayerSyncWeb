import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Cpu, Workflow, Database, ShieldCheck, Plug, Compass, Hammer, KeyRound } from 'lucide-react';
import { CTAButton, GhostLink, Eyebrow, SectionHeader } from '../components/site/Primitives';

/**
 * What We Build — the cash engine. Absorbs the former SMB and Enterprise
 * vertical pages into a single capability statement. Deliberately NOT a
 * service menu: it describes how we work and what we build, then sends people
 * to a diagnostic.
 */
export const WhatWeBuild: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const phases = [
    {
      icon: <Compass className="w-6 h-6" />,
      tag: 'Diagnose',
      t: 'We find where the work actually breaks',
      d: 'Before anything gets built, we map how your operation runs today — where time leaks, where things fall through, what only lives in one person’s head.',
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      tag: 'Build',
      t: 'We build the system around that',
      d: 'A custom system that fits how you actually work — not a template you have to bend your business around. Built to do one job well, then extended.',
    },
    {
      icon: <KeyRound className="w-6 h-6" />,
      tag: 'Own',
      t: 'You own it, we hand it over',
      d: 'It runs on your infrastructure, your data stays yours, and your team can operate it. We stay for support, not for lock-in.',
    },
  ];

  const capabilities = [
    { icon: <Workflow className="w-6 h-6" />, t: 'Workflow & operations systems', d: 'Replace the spreadsheet-and-WhatsApp duct tape: intake, routing, follow-ups, approvals, reporting — handled in one place.' },
    { icon: <Cpu className="w-6 h-6" />, t: 'AI agents that do real work', d: 'Agents that answer enquiries, qualify leads, draft documents and chase the follow-ups your team never gets to.' },
    { icon: <Database className="w-6 h-6" />, t: 'Custom dashboards & CRMs', d: 'One source of truth for your pipeline, customers and numbers — built around your process, not a generic CRM.' },
    { icon: <Plug className="w-6 h-6" />, t: 'Integrations', d: 'We connect the tools you already use — WhatsApp, accounting, portals, email — so data stops being re-typed.' },
    { icon: <ShieldCheck className="w-6 h-6" />, t: 'Secure, private deployment', d: 'For larger organisations: systems deployed in your environment, with your data kept private and access controlled.' },
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      {/* HERO */}
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-28 px-4 md:px-6 overflow-hidden">
        <div className="ambient-glow absolute top-[10%] left-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-green/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Eyebrow><Cpu className="w-3 h-3" /> What we build</Eyebrow>
          <h1 className="hero-heading mb-8 text-shimmer">
            Custom systems for businesses that have outgrown <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">spreadsheets and WhatsApp.</span>
          </h1>
          <p className="sub-heading max-w-2xl mx-auto mb-12">
            SynCRM is what we build for real estate. This is everything else: the operations
            systems, AI agents and custom software we build for businesses that have hit the
            ceiling of what manual work and off-the-shelf tools can do.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton />
            <GhostLink to="/work" label="See our work" />
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={<>We don't sell packages. We <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">diagnose, build, and hand over.</span></>}
            sub="Every engagement starts the same way — by understanding the operation before proposing anything."
          />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
            {phases.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card card-hover-glow rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-8">{p.icon}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">{p.tag}</div>
                <h3 className="text-xl md:text-2xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">{p.t}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <div className="ambient-glow absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            title={<>What that looks like in <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">practice.</span></>}
            sub="The shape of the system depends on the diagnosis. These are the things we most often end up building."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
            {capabilities.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-[32px] p-8 border border-black/5 dark:border-white/5"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-6">{c.icon}</div>
                <h3 className="text-lg md:text-xl font-light mb-3 text-gray-900 dark:text-dark-text-primary">{c.t}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-24 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center relative overflow-hidden"
        >
          <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-green/10 to-brand-orange/10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="hero-heading mb-8 text-shimmer">Tell us what's breaking.</h3>
            <p className="sub-heading mb-12 max-w-2xl mx-auto">
              A diagnostic is a short, honest conversation about where your operation is losing
              time or money — and whether a system can fix it. If it can't, we'll tell you that too.
            </p>
            <CTAButton />
          </div>
        </motion.div>
      </section>
    </div>
  );
};
