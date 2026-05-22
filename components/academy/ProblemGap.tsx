import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Check, X } from 'lucide-react';

export const ProblemGap: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const comparisons = [
        {
            bad: "Theory-led — \"What is a prompt?\"",
            good: "Workflow-led — \"Rewrite your sales follow-up using AI\""
        },
        {
            bad: "Tool-specific — locked into one vendor",
            good: "Tool-agnostic — Claude, Gemini, ChatGPT, Copilot, n8n"
        },
        {
            bad: "One-off workshop, no reinforcement",
            good: "8-week programme + 90 days embedded support"
        },
        {
            bad: "Generic case studies from US tech firms",
            good: "Live exercises using your actual data and processes"
        },
        {
            bad: "Delivered by trainers who have never shipped AI",
            good: "Delivered by the team that ships AI for paying clients"
        }
    ];

    return (
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-light mb-8 text-gray-900 dark:text-dark-text-primary leading-tight">
                            The Real AI Gap Isn’t Tools. <br/>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">It’s Confidence.</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 dark:text-dark-text-secondary leading-relaxed mb-6">
                            Your leadership has approved an AI budget. Your IT team has rolled out ChatGPT, Copilot, or Gemini licences. But six months in, only a handful of power users are actually getting value from them — and the rest of the company treats AI like a fancier search bar.
                        </p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                            The problem is not the tools. The problem is that nobody has trained your people to think with AI inside the workflows they already run.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`glass-card p-8 md:p-10 rounded-[32px] border ${safeDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'} shadow-2xl relative overflow-hidden`}
                    >
                        {/* Subtle glow behind table */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 blur-[60px] pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400">Most AI Training</div>
                                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">Sync Academy</div>
                            </div>

                            <div className="space-y-6">
                                {comparisons.map((row, i) => (
                                    <div key={i} className="grid grid-cols-2 gap-4 items-start">
                                        <div className="flex gap-3">
                                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{row.bad}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Check className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-xs md:text-sm text-gray-900 dark:text-white font-medium">{row.good}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
