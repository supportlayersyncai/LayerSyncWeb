import React from 'react';
import { LaptopCarousel } from '../components/web-dev/LaptopCarousel';
import { TechStack } from '../components/web-dev/TechStack';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const WebDev: React.FC = () => {
    return (
        <div className="bg-[#050505] min-h-screen pb-20 pt-24 md:pt-32 overflow-x-hidden">
            {/* Hero is integrated with Laptop Carousel */}
            <LaptopCarousel />

            <TechStack />

            {/* CTA */}
            <section className="py-20 text-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="inline-block p-[2px] rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500">
                    <button className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-black text-white font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3 hover:bg-white hover:text-black transition-colors">
                        Start Your Project <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </section>
        </div>
    );
};
