import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, User, ArrowRight } from 'lucide-react';

export const ChatbotViz: React.FC = () => {
    const [messages, setMessages] = useState<Array<{ id: number, text: string, sender: 'user' | 'bot' }>>([
        { id: 1, text: "Hi, is 124 Oak Street still available?", sender: 'user' }
    ]);

    // Simulation of conversation
    useEffect(() => {
        const sequence = [
            { id: 2, text: "Yes! It's currently active. Would you like to see photos or schedule a viewing?", sender: 'bot', delay: 1500 },
            { id: 3, text: "Schedule a viewing please.", sender: 'user', delay: 3500 },
            { id: 4, text: "Great. I have openings this Thursday at 2pm or Friday at 10am. Which works best?", sender: 'bot', delay: 5000 },
            { id: 5, text: "Friday works.", sender: 'user', delay: 7000 },
            { id: 6, text: "Perfect. I've booked you for Friday at 10am. A calendar invite has been sent to your email!", sender: 'bot', delay: 8500 }
        ];

        let timeouts: NodeJS.Timeout[] = [];

        sequence.forEach(msg => {
            const timeout = setTimeout(() => {
                setMessages(prev => [...prev, { id: msg.id, text: msg.text, sender: msg.sender as 'user' | 'bot' }]);
            }, msg.delay);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <section className="relative py-32 px-6 max-w-7xl mx-auto z-20">
            <div className="glass-card rounded-[48px] p-10 md:p-16 border border-black/5 dark:border-white/5 bg-white/50 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-blue-900/20">
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="order-2 md:order-1 relative h-[500px] bg-white dark:bg-black/40 rounded-[32px] border border-black/10 dark:border-white/10 p-6 overflow-hidden flex flex-col shadow-inner dark:shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs text-gray-400 dark:text-white/40 font-mono">LayerSync Agent v2.0</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            <AnimatePresence mode='popLayout'>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-black/5 dark:bg-white/10 text-gray-800 dark:text-white rounded-br-none'
                                            : 'bg-purple-600 text-white rounded-bl-none shadow-lg shadow-purple-900/20'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex gap-3">
                            <div className="flex-1 h-10 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
                            <div className="w-10 h-10 rounded-full bg-purple-600/50 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 flex flex-col justify-center text-gray-900 dark:text-white">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 text-purple-500 dark:text-purple-400">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light mb-6">Automated <span className="text-purple-600 dark:text-purple-400 font-normal">*Lead Qual*</span></h2>
                        <p className="text-lg text-gray-600 dark:text-white/60 mb-8 leading-relaxed">
                            Never miss a lead again. Our AI agent handles inquiries via WhatsApp, SMS, and Web 24/7. It qualifies budgets, answers property questions, and syncs directly with your CRM.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mt-1"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Instant Response</h4>
                                    <p className="text-sm text-gray-600 dark:text-white/50">Engagement under 3 seconds drastically increases conversion.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-1"><User className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">CRM Sync</h4>
                                    <p className="text-sm text-gray-600 dark:text-white/50">Automatically creates contacts in Follow Up Boss or HubSpot.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
