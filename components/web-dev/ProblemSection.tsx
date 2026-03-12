import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Eye, TrendingDown, UserX, Palette, Layout } from 'lucide-react';

interface ProblemSectionProps {
    isDarkMode: boolean;
}

const problems = [
    {
        icon: Eye,
        title: 'Looks Dated',
        desc: 'Visitors judge your business in under 3 seconds. An outdated design signals an outdated company.',
    },
    {
        icon: Palette,
        title: 'Feels Generic',
        desc: 'Template-driven sites fail to differentiate. Your brand disappears in a sea of sameness.',
    },
    {
        icon: TrendingDown,
        title: 'Reduces Trust',
        desc: 'Poor design erodes credibility before a visitor even reads your content.',
    },
    {
        icon: Layout,
        title: 'Weak Structure',
        desc: 'Without clear hierarchy, visitors struggle to understand what you offer and why it matters.',
    },
    {
        icon: UserX,
        title: 'Loses Leads',
        desc: 'Confusing navigation and buried CTAs quietly drive potential clients to your competitors.',
    },
    {
        icon: AlertTriangle,
        title: 'Hurts Perception',
        desc: 'Your website communicates your value before you do. A weak site undermines your market position.',
    },
];

export const ProblemSection: React.FC<ProblemSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-24 md:py-32 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                        The Problem
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Outdated Websites{' '}
                        <span className={isDarkMode ? 'text-white/30' : 'text-gray-300'}>Quietly Lose</span>{' '}
                        Trust
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Most businesses don't realize their website is their biggest liability. 
                        While you focus on delivering great work, your site is silently turning people away.
                    </p>
                </motion.div>

                {/* Problem cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={problem.title}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className={`glass-card rounded-2xl p-7 group hover:scale-[1.02] ${isDarkMode ? 'hover:border-red-500/10' : 'hover:border-red-400/15'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${isDarkMode ? 'bg-red-500/8 text-red-400/70' : 'bg-red-50 text-red-400'}`}>
                                <problem.icon className="w-5 h-5" />
                            </div>
                            <h3 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {problem.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                {problem.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
