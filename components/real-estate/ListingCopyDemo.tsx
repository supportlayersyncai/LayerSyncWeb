import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, Type } from 'lucide-react';

const generatedCopy = `Welcome to an extraordinary residence in Pacific Heights, where timeless elegance meets modern sophistication. This stunning 4-bedroom, 3.5-bathroom home spans 3,200 square feet of meticulously designed living space.

Step through the grand foyer into a sun-drenched open floor plan featuring 10-foot ceilings and wide-plank oak hardwood floors. The chef's kitchen boasts Thermador appliances, a waterfall quartz island, and custom cabinetry.

The primary suite is a private sanctuary with panoramic bay views and a spa-inspired bathroom. Three additional bedrooms provide generous space for family and guests. A landscaped rear garden creates an urban oasis perfect for al fresco entertaining.`;

const propertyDetails = [
    { label: "Address", value: "124 Oak Street" },
    { label: "Bedrooms", value: "4" },
    { label: "Bathrooms", value: "3.5" },
    { label: "Sq Ft", value: "3,200" },
    { label: "Price", value: "$2,850,000" },
    { label: "Style", value: "Modern Victorian" },
];

export const ListingCopyDemo: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;
    const [displayedText, setDisplayedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) return;
        setIsGenerating(true);
        setDisplayedText('');
        let index = 0;
        const interval = setInterval(() => {
            if (index < generatedCopy.length) {
                setDisplayedText(generatedCopy.slice(0, index + 1));
                index++;
            } else {
                setIsGenerating(false);
                clearInterval(interval);
            }
        }, 12);
        return () => clearInterval(interval);
    }, [hasStarted]);

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onViewportEnter={() => !hasStarted && setHasStarted(true)}
                className="text-center mb-12 md:mb-20"
            >
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI-Written <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Listing Copy</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Professional property descriptions generated in seconds.
                </p>
            </motion.div>

            <div className={`glass-card rounded-[32px] md:rounded-[48px] border overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <div className="grid lg:grid-cols-5 gap-0">
                    {/* Property Details */}
                    <div className={`lg:col-span-2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400"><Type className="w-5 h-5" /></div>
                            <div>
                                <div className={`text-xs uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Input</div>
                                <div className={`text-sm font-medium ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Property Details</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {propertyDetails.map((d, i) => (
                                <div key={i} className={`flex justify-between items-center py-3 px-4 rounded-xl ${safeDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                    <span className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{d.label}</span>
                                    <span className={`text-sm font-medium ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{d.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-green-500 animate-pulse' : 'bg-purple-500'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                                {isGenerating ? 'Generating...' : displayedText.length > 0 ? 'Complete' : 'Waiting...'}
                            </span>
                        </div>
                    </div>

                    {/* Generated Copy */}
                    <div className={`lg:col-span-3 p-6 md:p-10 ${safeDarkMode ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg"><Sparkles className="w-5 h-5" /></div>
                            <div>
                                <div className={`text-xs uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Output</div>
                                <div className={`text-sm font-medium ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>AI-Generated Description</div>
                            </div>
                        </div>
                        <div className={`min-h-[250px] text-sm leading-[1.8] whitespace-pre-wrap ${safeDarkMode ? 'text-white/70' : 'text-gray-700'}`}>
                            {displayedText}
                            {isGenerating && <span className="inline-block w-0.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />}
                        </div>
                        {!isGenerating && displayedText.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-8 pt-6 border-t flex items-center gap-6 ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                                {[{ v: "642", l: "Characters" }, { v: "3.2s", l: "Generated" }, { v: "$0.05", l: "Cost" }].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <div className={`text-lg font-light ${safeDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{s.v}</div>
                                        <div className={`text-[9px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>{s.l}</div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
