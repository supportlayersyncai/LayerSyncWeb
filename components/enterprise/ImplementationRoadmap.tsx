import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Search, PenTool, Rocket, Repeat } from 'lucide-react';

const phases = [
    {
        title: "Discovery & Assessment",
        time: "Weeks 1-2",
        icon: <Search className="w-5 h-5" />,
        desc: "Deep dive into existing workflows, data security audit, and identification of high-ROI automation targets."
    },
    {
        title: "Architecture Design",
        time: "Weeks 3-4",
        icon: <PenTool className="w-5 h-5" />,
        desc: "Custom blueprint for LLM deployment, integration mapping, and security compliance verification."
    },
    {
        title: "Pilot Deployment",
        time: "Weeks 5-8",
        icon: <Rocket className="w-5 h-5" />,
        desc: "Deployment of initial agents to a single department. Rigorous testing and workflow refinement."
    },
    {
        title: "Org-Wide Rollout",
        time: "Weeks 9-12+",
        icon: <Repeat className="w-5 h-5" />,
        desc: "Phased rollout across departments, employee training, and establishment of continuous optimization loops."
    }
];

export const ImplementationRoadmap: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Structured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Implementation</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    A proven 90-day methodology for bringing enterprise AI from concept to production.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 relative">
                {/* Connecting Line */}
                <div className={`hidden md:block absolute top-12 left-10 right-10 h-[2px] ${safeDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "calc(100% - 5rem)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="hidden md:block absolute top-12 left-10 h-[2px] bg-gradient-to-r from-emerald-600 to-teal-600" 
                />

                {phases.map((phase, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="relative pt-0 md:pt-20"
                    >
                        {/* Node */}
                        <div className={`absolute top-0 md:left-1/2 md:-translate-x-1/2 w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shadow-xl z-10 ${safeDarkMode ? 'bg-[#0A0A0A] border-emerald-500/50 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-600'}`}>
                            <div className="mb-1">{phase.icon}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest">{`Phase ${i+1}`}</div>
                        </div>

                        {/* Content */}
                        <div className={`glass-card mt-28 md:mt-12 rounded-[24px] p-6 border text-center h-full ${safeDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                            <div className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${safeDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{phase.time}</div>
                            <h3 className={`text-lg font-bold mb-3 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{phase.title}</h3>
                            <p className={`text-sm ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{phase.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
