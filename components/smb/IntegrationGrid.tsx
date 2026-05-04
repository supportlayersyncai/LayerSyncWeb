import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Mail, Slack, Calendar, MessageSquare, Phone, Map, DollarSign, Database, HardDrive, FileText, Share2, Server } from 'lucide-react';

const apps = [
    { icon: <Mail className="w-8 h-8" />, name: "Gmail" },
    { icon: <Slack className="w-8 h-8" />, name: "Slack" },
    { icon: <Calendar className="w-8 h-8" />, name: "Google Calendar" },
    { icon: <MessageSquare className="w-8 h-8" />, name: "Intercom" },
    { icon: <Phone className="w-8 h-8" />, name: "Twilio" },
    { icon: <Map className="w-8 h-8" />, name: "Google Maps" },
    { icon: <DollarSign className="w-8 h-8" />, name: "Stripe" },
    { icon: <Database className="w-8 h-8" />, name: "Airtable" },
    { icon: <HardDrive className="w-8 h-8" />, name: "Google Drive" },
    { icon: <FileText className="w-8 h-8" />, name: "Notion" },
    { icon: <Share2 className="w-8 h-8" />, name: "HubSpot" },
    { icon: <Server className="w-8 h-8" />, name: "Salesforce" },
];

export const IntegrationGrid: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Connects to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">5000+ Apps</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    If it has an API, we can automate it.
                </p>
            </motion.div>

            <div className="relative">
                {/* Glowing Background Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 relative z-10">
                    {apps.map((app, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className={`glass-card aspect-square rounded-[24px] flex flex-col items-center justify-center p-4 border transition-all duration-300 hover:scale-105 cursor-pointer ${safeDarkMode ? 'border-white/5 hover:border-cyan-500/30 bg-white/[0.02]' : 'border-black/5 hover:border-cyan-500/30 bg-black/[0.02]'}`}
                        >
                            <div className={`mb-3 ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>{app.icon}</div>
                            <div className={`text-[10px] font-bold text-center ${safeDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{app.name}</div>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
                    <p className={`text-sm ${safeDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Powered by Zapier & Make.com integrations</p>
                </motion.div>
            </div>
        </section>
    );
};
