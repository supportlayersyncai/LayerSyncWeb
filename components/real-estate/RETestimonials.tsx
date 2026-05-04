import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    { name: "Sarah Chen", role: "Managing Director", agency: "Sotheby's International", quote: "LayerSync cut our staging costs by 95% and our listings are selling 40% faster. The AI staging quality is indistinguishable from professional photos.", rating: 5 },
    { name: "Marcus Rivera", role: "Team Lead", agency: "Compass Real Estate", quote: "The WhatsApp lead agent alone paid for itself in the first week. We're capturing leads at 3am that we used to lose entirely.", rating: 5 },
    { name: "Jennifer Park", role: "Broker", agency: "RE/MAX Premier", quote: "I was skeptical about AI-generated listing copy, but our engagement rates doubled. The descriptions are better than what most agents write.", rating: 5 },
];

const stats = [
    { value: "500+", label: "Listings Staged" },
    { value: "12", label: "Agency Partners" },
    { value: "$2M+", label: "Client Savings" },
    { value: "24/7", label: "Lead Capture" },
];

export const RETestimonials: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Top Agencies</span>
                </h2>
            </motion.div>

            {/* Stats Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 border mb-12 md:mb-16 ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <div className={`text-2xl md:text-4xl font-light bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>{s.value}</div>
                            <div className={`text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-2 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`glass-card card-hover-glow rounded-[24px] md:rounded-[32px] p-8 md:p-10 border cursor-pointer ${safeDarkMode ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}
                    >
                        <Quote className={`w-8 h-8 mb-6 ${safeDarkMode ? 'text-purple-500/30' : 'text-purple-300'}`} />
                        <p className={`text-sm leading-relaxed mb-8 ${safeDarkMode ? 'text-white/70' : 'text-gray-700'}`}>"{t.quote}"</p>
                        <div className="flex items-center gap-2 mb-4">
                            {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            ))}
                        </div>
                        <div className={`text-sm font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                        <div className={`text-xs ${safeDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t.role}, {t.agency}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
