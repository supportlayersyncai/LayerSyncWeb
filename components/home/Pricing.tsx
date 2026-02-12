import React from 'react';
import { motion } from 'framer-motion';
import { Check, Phone, Sparkles } from 'lucide-react';

interface PricingProps {
    isDarkMode: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ isDarkMode }) => {
    // const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5"; // Removed manual check

    const packages = [
        {
            name: "Lead Management System",
            tagline: "Capture. Qualify. Convert.",
            icon: "📡",
            features: [
                "AI Chatbot (WhatsApp, Web & SMS)",
                "Automated Lead Qualification",
                "CRM Auto-Sync (HubSpot, Salesforce)",
                "Smart Appointment Scheduling",
                "Lead Scoring & Prioritization",
                "Monthly Performance Reports"
            ]
        },
        {
            name: "Content Creation System",
            tagline: "Create. Distribute. Dominate.",
            icon: "✨",
            popular: true,
            features: [
                "AI Virtual Staging (Unlimited)",
                "Automated Listing Descriptions",
                "Social Media Content Packs",
                "AI Video Marketing (Reels & Tours)",
                "Multi-Channel Distribution",
                "Brand Voice Customization",
                "SEO-Optimized Blog Generation"
            ]
        },
        {
            name: "Digital Transformation",
            tagline: "Automate. Scale. Evolve.",
            icon: "🚀",
            features: [
                "Full Business Process Audit",
                "Custom AI Agent Development",
                "Workflow Automation (5000+ Apps)",
                "Premium Web Portal / App Build",
                "Dedicated Success Manager",
                "Priority 24/7 Support",
                "Quarterly Strategy Reviews"
            ]
        }
    ];

    return (
        <section id="pricing" className="relative py-20 md:py-40 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16 md:mb-24"
            >
                <div className="inline-flex items-center gap-2 mb-8 py-2 px-6 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-gray-300">
                    <Sparkles className="w-3 h-3" /> Solutions
                </div>
                <h2 className="hero-heading mb-6">Our *Systems*</h2>
                <p className="sub-heading max-w-2xl mx-auto text-gray-600 dark:text-gray-400">Tailored AI systems designed around your business needs. No one-size-fits-all. No hidden fees.</p>
            </motion.div>
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {packages.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`p-8 md:p-10 rounded-[32px] md:rounded-[48px] border flex flex-col transition-all duration-500 hover:scale-[1.02] card-hover-glow ${p.popular
                            ? 'border-blue-500/30 bg-blue-500/5 glass-card shadow-2xl shadow-blue-900/10'
                            : `border-black/5 dark:border-white/5 glass-card`
                            }`}
                    >
                        {p.popular && (
                            <div className="text-[9px] uppercase tracking-[0.3em] font-black text-blue-400 mb-6">Most Popular</div>
                        )}
                        <div className="text-4xl mb-6">{p.icon}</div>
                        <h3 className="text-xl md:text-2xl font-light mb-2 text-gray-900 dark:text-white">{p.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-8">{p.tagline}</p>

                        <div className="space-y-4 mb-10 flex-1">
                            {p.features.map((f, fi) => (
                                <div key={fi} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 md:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-[11px] btn-glow flex items-center justify-center gap-3 ${p.popular
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : `border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-gray-900 dark:text-white`
                            }`}>
                            <Phone className="w-4 h-4" /> Book a Call
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
