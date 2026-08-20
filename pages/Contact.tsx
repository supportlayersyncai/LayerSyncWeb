import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { Send, Check, Loader2, Calendar, Compass, Hammer, KeyRound } from 'lucide-react';
import { Eyebrow } from '../components/site/Primitives';
import { FloatingOrbs, Reveal } from '../components/site/Backgrounds';
import { submitDiagnostic, type DiagnosticRequest, type SubmitResult } from '../lib/submitDiagnostic';

/**
 * Contact — "Book a diagnostic". Split personality: the pitch + what-to-expect
 * on the left, the form on the right. Submits through lib/submitDiagnostic.ts
 * (the single backend integration point), which no-ops gracefully until the
 * LayerSync Supabase project is wired.
 */
export const Contact: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const [form, setForm] = useState<DiagnosticRequest>({
    name: '', business: '', role: '', email: '', whatsapp: '', blindSpot: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [result, setResult] = useState<SubmitResult | null>(null);

  const update = (field: keyof DiagnosticRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    const res = await submitDiagnostic(form);
    setResult(res);
    setStatus(res.ok ? 'done' : 'idle');
  };

  const inputClass = `w-full rounded-2xl px-5 py-4 text-sm bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-tertiary focus:outline-none focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/15 transition-all`;
  const labelClass = `block text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 dark:text-dark-text-tertiary mb-2`;

  const expect = [
    { icon: <Compass className="w-5 h-5" />, t: 'Diagnose', d: 'A short call about how your operation runs and where it leaks.' },
    { icon: <Hammer className="w-5 h-5" />, t: 'Build', d: 'If a system would help, we scope exactly what we’d build.' },
    { icon: <KeyRound className="w-5 h-5" />, t: 'Own', d: 'You own what we build — no packages, no lock-in.' },
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      <section className="relative pt-36 md:pt-48 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <FloatingOrbs accent="green" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — pitch + what to expect */}
          <div className="lg:pt-6">
            <Reveal><Eyebrow><Calendar className="w-3 h-3" /> Book a diagnostic</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="hero-heading mb-6 text-shimmer">
                Tell us about your <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">operation.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sub-heading max-w-md mb-12">
                No pitch, no packages. Tell us what's breaking and we'll tell you — honestly —
                whether a system can fix it.
              </p>
            </Reveal>
            <div className="space-y-5">
              {expect.map((s, i) => (
                <Reveal key={i} delay={0.15 + i * 0.08}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-green/12 text-brand-green flex items-center justify-center flex-shrink-0">{s.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{s.t}</div>
                      <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{s.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'done' ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[32px] p-10 md:p-14 border border-black/5 dark:border-white/5 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">Got it.</h2>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-md mx-auto">{result?.message}</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="glass-card rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5 space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass} htmlFor="name">Your name</label>
                    <input id="name" required value={form.name} onChange={update('name')} className={inputClass} placeholder="Jane Moyo" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="business">Business</label>
                    <input id="business" required value={form.business} onChange={update('business')} className={inputClass} placeholder="Your company / brokerage" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass} htmlFor="role">Your role</label>
                    <input id="role" value={form.role} onChange={update('role')} className={inputClass} placeholder="Owner, principal, ops lead…" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">Email</label>
                    <input id="email" type="email" required value={form.email} onChange={update('email')} className={inputClass} placeholder="you@business.com" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="whatsapp">WhatsApp (optional)</label>
                  <input id="whatsapp" value={form.whatsapp} onChange={update('whatsapp')} className={inputClass} placeholder="+263…" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="blindSpot">What can't you see, or what keeps breaking?</label>
                  <textarea id="blindSpot" required rows={4} value={form.blindSpot} onChange={update('blindSpot')} className={inputClass} placeholder="e.g. Leads come in on WhatsApp and we lose track of them. I can't see which deals are stalling until it's too late." />
                </div>

                {result && !result.ok && <p className="text-sm text-brand-orange">{result.message}</p>}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-glow group w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <>Book my diagnostic <Send className="w-4 h-4 cta-arrow" /></>
                  )}
                </button>
                <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 dark:text-dark-text-tertiary font-bold">
                  No commitment · We reply within one business day
                </p>
                <p className="text-center text-xs text-gray-400 dark:text-dark-text-tertiary leading-relaxed">
                  We use these details only to reply to you. We never sell them or add you to a
                  mailing list. See our{' '}
                  <Link to="/privacy" className="underline hover:text-brand-orange">Privacy Policy</Link>.
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
