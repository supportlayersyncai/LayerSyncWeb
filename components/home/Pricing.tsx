import React from 'react';
import { Check } from 'lucide-react';

interface PricingProps {
    isDarkMode: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ isDarkMode }) => {
    const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";

    const packages = [
        {
            name: "Starter Bundle",
            price: "$120",
            bestFor: "Small Agencies (5-15 agents)",
            features: [
                "20 Staging Images / mo",
                "10 Content Listings / mo",
                "10 Marketing Videos / mo",
                "Weekly Tech Support",
                "Standard API Access"
            ],
            savings: "Save $50 (29% Discount)"
        },
        {
            name: "Professional Bundle",
            price: "$500",
            bestFor: "Medium Agencies (15-50 agents)",
            popular: true,
            features: [
                "50 Staging Images / mo",
                "30 Content Listings / mo",
                "AI Chatbot (2k conv/mo)",
                "30 Marketing Videos / mo",
                "Priority CRM Integration",
                "Dedicated Success Manager"
            ],
            savings: "Save $225 (31% Discount)"
        },
        {
            name: "Enterprise Bundle",
            price: "$1,200",
            bestFor: "Large Agencies (50+ agents)",
            features: [
                "150 Staging Images / mo",
                "100 Content Listings / mo",
                "Unlimited AI Chatbot",
                "40 Transaction Slots / mo",
                "100 Marketing Videos / mo",
                "Full System Optimization"
            ],
            savings: "Save $730 (38% Discount)"
        }
    ];

    return (
        <section id="pricing" className="relative py-32 sm:py-60 px-6 max-w-7xl mx-auto z-20">
            <div className="text-center mb-32">
                <h2 className="hero-heading mb-10">System *Bundles*</h2>
                <p className="sub-heading">Value-based pricing for the modern African brokerage. Accept USD and ZiG.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {packages.map((p, i) => (
                    <div key={i} className={`p-10 rounded-[48px] border flex flex-col items-center text-center transition-all duration-700 hover:scale-[1.02] ${p.popular ? 'border-blue-500/40 bg-blue-500/5 glass-card shadow-2xl' : borderSubtle}`}>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8">{p.name}</h5>
                        <div className="text-6xl font-light mb-2">{p.price}</div>
                        <div className="text-xs opacity-40 mb-12">per month</div>
                        <div className="space-y-5 mb-16 flex-1">
                            {p.features.map((f, fi) => (
                                <div key={fi} className="flex items-center gap-3 text-sm opacity-60"><Check className="w-4 h-4 text-blue-500" /> {f}</div>
                            ))}
                        </div>
                        <button className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] btn-glow ${p.popular ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : 'border ' + borderSubtle}`}>Get Started</button>
                    </div>
                ))}
            </div>
        </section>
    );
};
