import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Users, Search, MessageCircle, Star, BarChart, Rocket } from 'lucide-react';

interface BusinessImpactSectionProps {
    isDarkMode: boolean;
}

const impacts = [
    { icon: TrendingUp, label: 'Stronger First Impressions' },
    { icon: Star, label: 'Better Perceived Value' },
    { icon: Shield, label: 'Improved Trust & Credibility' },
    { icon: Users, label: 'More Qualified Inquiries' },
    { icon: MessageCircle, label: 'Clearer Communication' },
    { icon: Search, label: 'Higher Quality Leads' },
    { icon: BarChart, label: 'Stronger Online Authority' },
    { icon: Rocket, label: 'A Website That Supports Growth' },
];

export const BusinessImpactSection: React.FC<BusinessImpactSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-24 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                        Business Impact
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Design That Drives{' '}
                        <span className="text-shimmer">Results</span>
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        A premium website isn't a cost. It's an investment in how your business is 
                        perceived, how it competes, and how it grows.
                    </p>
                </motion.div>

                {/* Impact items - clean 2-column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {impacts.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -15 : 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className={`flex items-center gap-4 p-5 rounded-xl group transition-all duration-300 ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'}`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/8 text-cyan-400/60 group-hover:text-cyan-400' : 'bg-cyan-50 text-cyan-600/60 group-hover:text-cyan-600'} transition-colors duration-300`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-white/60 group-hover:text-white/90' : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-300`}>
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
