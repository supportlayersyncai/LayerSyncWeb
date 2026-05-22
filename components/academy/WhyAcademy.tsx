import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const WhyAcademy: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const differentiators = [
        {
            title: "Builders, Not Theorists",
            desc: "The same team that ships AI systems for paying clients delivers your training. Every trainer has shipped production AI — not just taught about it. You’re learning from operators, not lecturers."
        },
        {
            title: "Workflow-First, Tool-Second",
            desc: "We don’t train on tools in isolation. We train inside the workflows your team already runs — finance closes, sales follow-ups, recruiting funnels, ops handoffs. The training compounds because the work itself becomes the curriculum."
        },
        {
            title: "Tool-Agnostic",
            desc: "Claude, Gemini, ChatGPT, Copilot, n8n, your internal stack — we teach what your team actually uses, not what we want to sell. No vendor lock-in. No biased recommendations. Just fluency across the tools that matter."
        },
        {
            title: "Built for African Markets",
            desc: "Dual-currency reporting, WhatsApp-first customer communication, local compliance considerations, and the cost realities of operating in Zimbabwe and Southern Africa — all baked into the curriculum. No global training provider can match this depth of regional context."
        },
        {
            title: "Measurable Output",
            desc: "Every track ends with deliverables — saved prompts, working automations, agent libraries — that compound long after the training ends. We measure your team’s AI fluency before and after, and report the delta to leadership."
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
                    <h2 className="hero-heading mb-6">Why *Sync Academy*?</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {differentiators.map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card p-8 md:p-10 rounded-[32px] border ${safeDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'} hover:border-indigo-500/30 transition-all duration-300 card-hover-glow`}
                        >
                            <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-6" />
                            <h3 className="text-xl md:text-2xl font-light mb-4 text-gray-900 dark:text-white">{d.title}</h3>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                {d.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
