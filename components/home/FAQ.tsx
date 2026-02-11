import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQProps {
    isDarkMode: boolean;
}

export const FAQ: React.FC<FAQProps> = ({ isDarkMode }) => {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";

    const faqs = [
        { q: "Do you accept local currency (ZiG)?", a: "Yes. While our core pricing is in USD, we accept ZiG at prevailing RBZ rates, updated weekly. We support EcoCash, InnBucks, and local bank transfers." },
        { q: "Is there a free trial?", a: "We offer a 7-day trial with limited usage (5 staging images, 3 listings) so you can experience the ROI first-hand. No credit card required." },
        { q: "How long does implementation take?", a: "Typically 3-5 business days. We handle the technical layering while your team continues with their daily operations." },
        { q: "What if we only need one service?", a: "We offer À La Carte options starting at $2.50/image or $150/mo for chatbots. Bundles simply offer the best market value." }
    ];

    return (
        <section className="relative py-32 sm:py-60 px-6 max-w-4xl mx-auto z-20">
            <h2 className="hero-heading mb-20 text-center text-shimmer">Common *Questions*</h2>
            <div className="space-y-5">
                {faqs.map((faq, i) => (
                    <div key={i} className={`rounded-[32px] border ${borderSubtle} cursor-pointer overflow-hidden transition-colors`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                        <div className="p-8 flex items-center justify-between">
                            <h6 className="text-xl font-light">{faq.q}</h6>
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {activeFaq === i && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-8 opacity-40 text-lg">
                                    {faq.a}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
};
