import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Send, Check, Loader2, Calendar } from 'lucide-react';
import { Eyebrow } from '../components/site/Primitives';
import { submitDiagnostic, type DiagnosticRequest, type SubmitResult } from '../lib/submitDiagnostic';

/**
 * Contact — "Book a diagnostic". The one piece of net-new functionality.
 * Submits through lib/submitDiagnostic.ts (the single backend integration
 * point), which gracefully no-ops until the LayerSync Supabase project is wired.
 */
export const Contact: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const [form, setForm] = useState<DiagnosticRequest>({
    name: '',
    business: '',
    role: '',
    email: '',
    whatsapp: '',
    blindSpot: '',
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

  const inputClass = `w-full rounded-2xl px-5 py-4 text-sm bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-tertiary focus:outline-none focus:border-brand-orange/60 transition-colors`;
  const labelClass = `block text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 dark:text-dark-text-tertiary mb-2`;

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      <section className="relative pt-40 md:pt-52 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="ambient-glow absolute top-[10%] right-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Eyebrow><Calendar className="w-3 h-3" /> Book a diagnostic</Eyebrow>
            <h1 className="hero-heading mb-6 text-shimmer">
              Tell us about your <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">operation.</span>
            </h1>
            <p className="sub-heading max-w-xl mx-auto">
              A diagnostic is a short, honest conversation — no pitch, no packages. Tell us what's
              breaking and we'll tell you whether a system can fix it.
            </p>
          </div>

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
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-md mx-auto">
                {result?.message}
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="glass-card rounded-[32px] p-8 md:p-12 border border-black/5 dark:border-white/5 space-y-6"
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
                <textarea id="blindSpot" required rows={5} value={form.blindSpot} onChange={update('blindSpot')} className={inputClass} placeholder="e.g. Leads come in on WhatsApp and we lose track of them. I can't see which deals are stalling until it's too late." />
              </div>

              {result && !result.ok && (
                <p className="text-sm text-brand-orange">{result.message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-glow w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <>Book my diagnostic <Send className="w-4 h-4" /></>
                )}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 dark:text-dark-text-tertiary font-bold">
                No commitment · We reply within one business day
              </p>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
};
