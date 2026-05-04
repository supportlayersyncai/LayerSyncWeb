import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    { name: "David Miller", role: "CEO", company: "Apex Logistics", quote: "We replaced a 3-person data entry team with one LayerSync agent. The accuracy went from 92% to 100%, and the savings were immediate.", rating: 5, metric: "30 hrs/wk saved" },
    { name: "Jessica Wong", role: "Operations Manager", company: "Bright Smile Dental", quote: "The scheduling agent handles everything. No more double bookings, and no more staff spending hours on the phone confirming appointments.", rating: 5, metric: "0 missed appointments" },
    { name: "Thomas Wright", role: "Founder", company: "Wright Accounting", quote: "Our invoice generation used to take two days at the end of every month. Now it happens instantly when a project is marked complete in our CRM.", rating: 5, metric: "99% faster invoicing" },
];

export const SMBTestimonials: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Real Businesses. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">Real Savings.</span>
                </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`glass-card card-hover-glow rounded-[24px] md:rounded-[32px] p-8 md:p-10 border cursor-pointer ${safeDarkMode ? 'border-white/5 hover:border-cyan-500/30' : 'border-black/5 hover:border-cyan-500/30'}`}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Quote className={`w-6 h-6 ${safeDarkMode ? 'text-cyan-500/50' : 'text-cyan-500'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${safeDarkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
                                {t.metric}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed mb-8 ${safeDarkMode ? 'text-white/70' : 'text-gray-700'}`}>"{t.quote}"</p>
                        <div className="flex items-center gap-2 mb-4">
                            {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            ))}
                        </div>
                        <div className={`text-sm font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                        <div className={`text-xs ${safeDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t.role}, {t.company}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
