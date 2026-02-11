import React from 'react';
import { RealEstateHero } from '../components/real-estate/Hero';
import { RealEstateFeatures } from '../components/real-estate/BeforeAfter';
import { ChatbotViz } from '../components/real-estate/ChatbotViz';
import { motion } from 'framer-motion';

export const RealEstate: React.FC = () => {
    return (
        <div className="bg-[#050505] min-h-screen pb-20 overflow-x-hidden">
            <RealEstateHero />

            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
                <div className="px-0 sm:px-6"> {/* Remove padding on mobile for full-width slider feel, keep on desktop */}
                    <RealEstateFeatures />
                </div>
                <ChatbotViz />
            </div>

            <section className="py-20 text-center px-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 font-bold">Trusted by Top Agencies</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-30 grayscale">
                    <div className="text-xl md:text-2xl font-serif text-white">Sotheby's</div>
                    <div className="text-xl md:text-2xl font-serif text-white">Compass</div>
                    <div className="text-xl md:text-2xl font-serif text-white">RE/MAX</div>
                </div>
            </section>
        </div>
    );
};
