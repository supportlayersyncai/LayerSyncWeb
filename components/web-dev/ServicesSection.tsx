import React from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, LayoutDashboard, PenTool, MousePointerClick, Smartphone, MessageSquareText, Route } from 'lucide-react';

interface ServicesSectionProps {
    isDarkMode: boolean;
}

const services = [
    {
        icon: LayoutDashboard,
        title: 'Custom Landing Pages',
        desc: 'High-impact pages designed to convert visitors into leads, clients, or customers.',
    },
    {
        icon: Globe,
        title: 'Full Website Design',
        desc: 'Complete websites built from the ground up — strategically structured and visually premium.',
    },
    {
        icon: RefreshCw,
        title: 'Website Rebuilds & Redesigns',
        desc: 'Transforming outdated sites into modern, high-performing digital experiences.',
    },
    {
        icon: PenTool,
        title: 'Premium UI/UX Direction',
        desc: 'Interface design that balances aesthetics with usability — beautiful and functional.',
    },
    {
        icon: MousePointerClick,
        title: 'Conversion-Focused Structure',
        desc: 'Page architectures built around user behaviour and optimised for measurable outcomes.',
    },
    {
        icon: Smartphone,
        title: 'Responsive Modern Design',
        desc: 'Flawless experiences across every device, from desktop screens to mobile phones.',
    },
    {
        icon: MessageSquareText,
        title: 'Messaging Refinement',
        desc: 'Sharpening your copy and positioning so your value is communicated within seconds.',
    },
    {
        icon: Route,
        title: 'Strategic Layout & User Flow',
        desc: 'Guiding visitors through a deliberate journey that builds trust and drives action.',
    },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-24 md:py-32 px-6">
            {/* Subtle divider */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                        What We Offer
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Built for{' '}
                        <span className="text-shimmer">Impact</span>
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Every service is designed to produce a measurable shift in how your business 
                        is perceived and how effectively your website drives results.
                    </p>
                </motion.div>

                {/* Service cards: 2-column on md, 4 on lg */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className={`glass-card rounded-2xl p-6 group hover:scale-[1.02] ${isDarkMode ? 'hover:border-purple-500/15' : 'hover:border-purple-400/20'}`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-purple-500/8 text-purple-400/70' : 'bg-purple-50 text-purple-600'}`}>
                                <service.icon className="w-4.5 h-4.5" />
                            </div>
                            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {service.title}
                            </h3>
                            <p className={`text-[13px] leading-relaxed ${isDarkMode ? 'text-white/35' : 'text-gray-500'}`}>
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
