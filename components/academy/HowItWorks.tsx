import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const phases = [
        {
            num: "01",
            title: "Audit & Custom Curriculum",
            desc: "We start by mapping your actual workflows, tools, and current AI maturity — across every department in scope. The output is a custom curriculum built for your stack, your processes, and your team. Not a generic ChatGPT bootcamp.",
            timeline: "2 weeks"
        },
        {
            num: "02",
            title: "Live Training",
            desc: "Hands-on sessions per department, delivered on-site or virtually. Every exercise uses your real data, your real workflows, and your real tools. Participants leave each session with completed deliverables — prompt libraries, saved automations, or working agents — not just notes.",
            timeline: "4–6 weeks depending on scope"
        },
        {
            num: "03",
            title: "Embedded Reinforcement",
            desc: "Training without reinforcement decays in 30 days. We stay embedded for 90 days post-training — dedicated Slack or WhatsApp channels, weekly office hours, prompt libraries customised to your business, and on-call support when teams hit edge cases.",
            timeline: "90 days, with optional renewal"
        }
    ];

    return (
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="hero-heading mb-6">How Sync Academy *Works*</h2>
                </motion.div>

                <div className="space-y-8 md:space-y-12 relative">
                    {/* Connecting line */}
                    <div className="absolute left-[39px] md:left-[55px] top-[40px] bottom-[40px] w-[2px] bg-gradient-to-b from-indigo-500/50 via-violet-500/50 to-transparent hidden md:block" />

                    {phases.map((phase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className={`glass-card p-8 md:p-10 rounded-[32px] border ${safeDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'} relative flex flex-col md:flex-row gap-6 md:gap-10`}
                        >
                            <div className="flex-shrink-0 relative z-10">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                                    {phase.num}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{phase.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                    {phase.desc}
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                    Timeline: {phase.timeline}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
