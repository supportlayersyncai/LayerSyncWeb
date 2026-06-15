import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { LeadershipIcon, OperationsIcon, FinanceIcon, PeopleIcon, SalesIcon, MarketingIcon, SecurityIcon } from '../icons/BrandIcons';

export const DepartmentTracks: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const tracks = [
        {
            title: "Executive Track",
            icon: <LeadershipIcon className="w-6 h-6" />,
            audience: "For the leadership team.",
            desc: "AI strategy, governance, vendor evaluation, ROI measurement, and how to ask the right questions of your technical teams.",
            outcome: "Leaders who can sponsor AI initiatives credibly."
        },
        {
            title: "Operations Track",
            icon: <OperationsIcon className="w-6 h-6" />,
            audience: "For ops managers and process owners.",
            desc: "Process automation, workflow design with AI agents, exception handling, and how to measure throughput before and after.",
            outcome: "Ops teams that ship automations, not just plan them."
        },
        {
            title: "Finance Track",
            icon: <FinanceIcon className="w-6 h-6" />,
            audience: "For finance and accounting teams.",
            desc: "AI-assisted reporting, forecasting, expense categorisation, audit preparation, and dual-currency (ZiG/USD) workflow management.",
            outcome: "Faster closes, sharper variance analysis, cleaner audit trails."
        },
        {
            title: "HR & People Track",
            icon: <PeopleIcon className="w-6 h-6" />,
            audience: "For HR, talent, and L&D teams.",
            desc: "AI-assisted recruiting, CV screening with bias controls, internal training content generation, and performance review preparation.",
            outcome: "HR teams that move faster without losing the human judgement that matters."
        },
        {
            title: "Sales Track",
            icon: <SalesIcon className="w-6 h-6" />,
            audience: "For sales reps, BDRs, and sales managers.",
            desc: "AI-driven prospecting, personalised outreach at scale, proposal generation, CRM intelligence, and pipeline forecasting.",
            outcome: "More conversations, better conversations, faster closes."
        },
        {
            title: "Marketing Track",
            icon: <MarketingIcon className="w-6 h-6" />,
            audience: "For marketers and content teams.",
            desc: "Content generation at scale, campaign analytics, brand-safe AI use, social listening, and SEO with AI assistance.",
            outcome: "Marketing output that compounds without bloating headcount."
        },
        {
            title: "IT & Security Track",
            icon: <SecurityIcon className="w-6 h-6" />,
            audience: "For IT, infosec, and engineering teams.",
            desc: "Safe AI deployment patterns, prompt injection awareness, data governance, model evaluation, and integration architecture.",
            outcome: "IT teams that say yes to AI safely, instead of saying no by default."
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
                    <h2 className="hero-heading mb-6">Seven Tracks. <br className="hidden md:block" />One *Operating System* for AI.</h2>
                    <p className="sub-heading max-w-3xl mx-auto">
                        Every department uses AI differently. A finance manager needs AI to compress reporting cycles; a recruiter needs it to triage CVs; an executive needs it to evaluate vendor pitches. Sync Academy delivers a dedicated track for each — so every team gets training built for the work they actually do.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tracks.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card p-8 rounded-[24px] border ${safeDarkMode ? 'border-white/5 hover:border-white/10 bg-white/5' : 'border-black/5 hover:border-black/10 bg-black/5'} transition-all duration-300 card-hover-glow relative group`}
                        >
                            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                {t.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t.title}</h3>
                            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{t.audience}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">{t.desc}</p>
                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                                <p className="text-xs italic text-gray-500 dark:text-gray-400"><span className="font-semibold not-italic">Outcome:</span> {t.outcome}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
