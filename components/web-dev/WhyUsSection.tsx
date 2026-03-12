import React from 'react';
import { motion } from 'framer-motion';
import { Gem, BarChart3, Monitor, Target, Zap, Compass } from 'lucide-react';

interface WhyUsSectionProps {
    isDarkMode: boolean;
}

const differentiators = [
    {
        icon: Gem,
        title: 'Premium Design Taste',
        desc: 'Every pixel is placed with intention. We craft interfaces that feel refined, modern, and unmistakably premium.',
    },
    {
        icon: BarChart3,
        title: 'Strategic Business Understanding',
        desc: 'We design for outcomes, not just aesthetics. Every layout decision is rooted in your business goals.',
    },
    {
        icon: Monitor,
        title: 'Modern UX Thinking',
        desc: 'Intuitive navigation, deliberate flow, and frictionless experiences that guide visitors toward action.',
    },
    {
        icon: Target,
        title: 'Conversion-Aware Structure',
        desc: 'Pages built around user psychology and clear calls to action. Design that works as hard as you do.',
    },
    {
        icon: Zap,
        title: 'Polished Execution',
        desc: 'Fast load times, smooth interactions, and responsive layouts across every device and screen size.',
    },
    {
        icon: Compass,
        title: 'Future-Facing Positioning',
        desc: 'We build websites that position your business ahead of its market, not behind the curve.',
    },
];

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ isDarkMode }) => {
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
                        Why LayerSync AI
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Design That Means{' '}
                        <span className="text-shimmer">Business</span>
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        We combine the precision of a design studio with the strategic depth of a business consultancy. 
                        The result is a website that looks exceptional and performs even better.
                    </p>
                </motion.div>

                {/* Differentiator cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {differentiators.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className={`glass-card rounded-2xl p-7 group hover:scale-[1.02] ${isDarkMode ? 'hover:border-cyan-500/15' : 'hover:border-cyan-400/20'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${isDarkMode ? 'bg-cyan-500/8 text-cyan-400/70' : 'bg-cyan-50 text-cyan-600'}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
