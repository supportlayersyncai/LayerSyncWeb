import React from 'react';
import { LaptopCarousel } from '../components/web-dev/LaptopCarousel';
import { TechStack } from '../components/web-dev/TechStack';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { useOutletContext } from 'react-router-dom';

export const WebDev: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 pt-24 md:pt-32 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            {/* Hero is integrated with Laptop Carousel */}
            <LaptopCarousel isDarkMode={safeDarkMode} />

            <TechStack />

            {/* CTA */}
            <section className="py-20 text-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="inline-block p-[2px] rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500">
                    <button className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-black text-white dark:bg-black dark:text-white font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3 hover:bg-white hover:text-black transition-colors border border-transparent hover:border-black">
                        Start Your Project <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </section>
        </div>
    );
};
