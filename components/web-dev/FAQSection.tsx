import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
    isDarkMode: boolean;
}

const faqs = [
    {
        q: 'Can you redesign my current website instead of building from scratch?',
        a: 'Absolutely. We specialise in both full rebuilds and strategic redesigns. If your current site has solid foundations, we can refine the design, restructure the layout, and elevate the overall experience without starting over.',
    },
    {
        q: 'What if I already have content?',
        a: 'That is perfectly fine. We work with your existing content and refine it where needed. If your messaging needs sharpening, we can help with copywriting and content hierarchy as part of the project.',
    },
    {
        q: 'How long does a project usually take?',
        a: 'Most projects take between 3 to 6 weeks depending on scope and complexity. We prioritise getting it right over getting it fast, while still respecting your timeline.',
    },
    {
        q: 'Will the site be mobile responsive?',
        a: 'Every website we build is fully responsive and tested across all major devices, screen sizes, and browsers. Mobile performance is non-negotiable in our process.',
    },
    {
        q: 'Can you help improve conversion, not just aesthetics?',
        a: 'That is at the core of what we do. Great design without strategic intent is just decoration. We structure every page to guide visitors toward meaningful actions — whether that is booking a call, requesting a quote, or making a purchase.',
    },
    {
        q: 'What types of businesses do you work with?',
        a: 'We work with established businesses, growing brands, and service providers who understand that their online presence directly impacts their bottom line. If you take your business seriously, we are a good fit.',
    },
];

const FAQItem: React.FC<{ faq: typeof faqs[0]; isDarkMode: boolean; index: number }> = ({ faq, isDarkMode, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`glass-card rounded-2xl overflow-hidden ${isDarkMode ? 'hover:border-white/10' : 'hover:border-black/10'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-4 p-6 text-left transition-colors ${isDarkMode ? 'hover:bg-white/[0.01]' : 'hover:bg-black/[0.01]'}`}
            >
                <span className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>
                    {faq.q}
                </span>
                <ChevronDown className={`flex-shrink-0 w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className={`px-6 pb-6 text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const FAQSection: React.FC<FAQSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-24 md:py-32 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                        FAQ
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Common Questions
                    </h2>
                </motion.div>

                {/* FAQ items */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} isDarkMode={isDarkMode} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
