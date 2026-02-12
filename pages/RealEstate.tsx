import React from 'react';
import { RealEstateHero } from '../components/real-estate/Hero';
import { RealEstateFeatures } from '../components/real-estate/BeforeAfter';
import { ChatbotViz } from '../components/real-estate/ChatbotViz';
import { motion } from 'framer-motion';

import { useOutletContext } from 'react-router-dom';

export const RealEstate: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            <RealEstateHero />

            <div className="relative">
                <div className={`absolute top-0 left-0 w-full h-[150px] transition-colors duration-700 z-10 pointer-events-none ${safeDarkMode ? 'bg-gradient-to-b from-[#050505] to-transparent' : 'bg-gradient-to-b from-[#f5f5f7] to-transparent'}`} />
                <div className="px-0 sm:px-6"> {/* Remove padding on mobile for full-width slider feel, keep on desktop */}
                    <RealEstateFeatures />
                </div>
                <ChatbotViz />
            </div>

            <section className="py-20 text-center px-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-white/30 mb-8 font-bold">Trusted by Top Agencies</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-30 grayscale">
                    <div className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white">Sotheby's</div>
                    <div className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white">Compass</div>
                    <div className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white">RE/MAX</div>
                </div>
            </section>
        </div>
    );
};
