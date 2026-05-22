import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ArrowRight, Building, Layers, Scale } from 'lucide-react';

export const WhoIsItFor: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const audiences = [
        {
            title: "Enterprises",
            icon: <Building className="w-8 h-8" />,
            desc: "Mid-to-large organisations (100+ staff) that have rolled out AI licences company-wide and need to drive adoption across departments.",
            entryPoint: "Executive Track + 2–3 department tracks",
            investment: "$15K–$60K depending on scope"
        },
        {
            title: "Growing SMEs",
            icon: <Layers className="w-8 h-8" />,
            desc: "Businesses scaling past 25 staff that want to embed AI literacy into their culture before bad habits set in.",
            entryPoint: "Condensed cross-functional programme",
            investment: "$5K–$15K"
        },
        {
            title: "Professional Services Firms",
            icon: <Scale className="w-8 h-8" />,
            desc: "Law firms, accounting practices, consultancies, and agencies whose entire output is knowledge work — and where AI fluency directly translates to billable hours saved.",
            entryPoint: "Department-specific deep dive",
            investment: "$8K–$25K"
        }
    ];

    return (
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="hero-heading mb-6 max-w-4xl mx-auto">Built For Organisations That Have Bought AI — and Need It to *Actually Work*.</h2>
                </motion.div>

                {/* Audiences Grid */}
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-24">
                    {audiences.map((a, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card p-8 md:p-10 rounded-[32px] border ${safeDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'} flex flex-col h-full`}
                        >
                            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-6">
                                {a.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{a.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 flex-grow">
                                {a.desc}
                            </p>
                            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-white/10">
                                <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-bold uppercase tracking-widest">Typical Entry Point:</span><br/><span className="text-gray-900 dark:text-white mt-1 block">{a.entryPoint}</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-bold uppercase tracking-widest">Typical Investment:</span><br/><span className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">{a.investment}</span></p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Social Proof Anchor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 mb-8 py-2 px-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                        Trusted by Teams That Take AI Seriously
                    </div>
                    <div className={`glass-card p-8 md:p-12 rounded-[32px] border ${safeDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                        <h4 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">House of Stone Properties — Real Estate AI Seminar</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            Trained an agent team on WhatsApp auto-replies, virtual staging, AI listing copy generation, and follow-up sequences. Delivered full curriculum including seminar blueprint, ManyChat knowledge base, presenter script, and a 17-slide deck.
                        </p>
                        <a href="#" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center justify-center gap-2 hover:underline">
                            Read the Case Study <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`glass-card rounded-[40px] md:rounded-[64px] p-10 md:p-20 border text-center relative overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}
                >
                    <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-indigo-600/10 pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className={`hero-heading mb-8 text-shimmer`}>Train Your Team Before Your <span className="italic">Competitor Does.</span></h3>
                        <p className={`sub-heading mb-12 max-w-2xl mx-auto`}>Book a discovery call. We will scope a curriculum specific to your departments, headcount, and current AI maturity — and deliver a fixed-price proposal within five business days. No retainer required to scope.</p>
                        <button onClick={() => {
                            const el = document.querySelector('#contact');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }} className="btn-glow px-10 md:px-14 py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs shadow-2xl inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white cursor-pointer mb-6">
                            Book a Training Audit <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Free 45-minute scoping call. Fixed-price proposal within 5 business days. No commitment.</p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
