import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

const integrations = [
    { name: "Follow Up Boss", category: "CRM" },
    { name: "HubSpot", category: "CRM" },
    { name: "Zillow", category: "Listing" },
    { name: "MLS", category: "Listing" },
    { name: "Google Calendar", category: "Scheduling" },
    { name: "WhatsApp", category: "Messaging" },
    { name: "Twilio SMS", category: "Messaging" },
    { name: "Gmail", category: "Email" },
    { name: "Slack", category: "Notifications" },
    { name: "Zapier", category: "Automation" },
];

export const IntegrationMap: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Plugs Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Everything</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    LayerSync connects to every tool in your real estate tech stack. No migration required.
                </p>
            </motion.div>

            <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                {/* Center Hub */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="absolute z-20 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
                >
                    <div className="text-center text-white">
                        <div className="text-lg md:text-xl font-bold">Layer</div>
                        <div className="text-lg md:text-xl font-light">Sync</div>
                    </div>
                </motion.div>

                {/* Orbiting Nodes */}
                {integrations.map((item, i) => {
                    const total = integrations.length;
                    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 220;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <React.Fragment key={i}>
                            {/* Connecting Line */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`absolute w-[1px] z-10 origin-center ${safeDarkMode ? 'bg-gradient-to-b from-purple-500/30 to-transparent' : 'bg-gradient-to-b from-purple-300/40 to-transparent'}`}
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    height: `${radius}px`,
                                    transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                                    transformOrigin: 'top center',
                                }}
                            />
                            {/* Node */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
                                className="absolute z-20"
                                style={{ left: `calc(50% + ${x}px - 40px)`, top: `calc(50% + ${y}px - 28px)` }}
                            >
                                <div className={`glass-card rounded-2xl px-4 py-3 border text-center min-w-[80px] group cursor-pointer hover:scale-110 transition-transform duration-300 ${safeDarkMode ? 'border-white/10 hover:border-purple-500/30' : 'border-black/10 hover:border-purple-500/30'}`}>
                                    <div className={`text-xs font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</div>
                                    <div className={`text-[8px] uppercase tracking-widest font-bold mt-1 ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>{item.category}</div>
                                </div>
                            </motion.div>
                        </React.Fragment>
                    );
                })}

                {/* Animated Pulse Ring */}
                <motion.div
                    className={`absolute rounded-full border ${safeDarkMode ? 'border-purple-500/10' : 'border-purple-300/20'}`}
                    style={{ width: '200px', height: '200px' }}
                    animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                />
            </div>
        </section>
    );
};
