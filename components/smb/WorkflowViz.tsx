import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Database, Calendar, DollarSign, ArrowRight } from 'lucide-react';

export const WorkflowViz: React.FC = () => {
    const steps = [
        { icon: <Mail className="w-6 h-6" />, label: "Inquiry", color: "bg-pink-500" },
        { icon: <Database className="w-6 h-6" />, label: "CRM Entry", color: "bg-purple-500" },
        { icon: <Calendar className="w-6 h-6" />, label: "Booking", color: "bg-blue-500" },
        { icon: <DollarSign className="w-6 h-6" />, label: "Invoice", color: "bg-green-500" }
    ];

    return (
        <section className="relative py-20 px-6 max-w-7xl mx-auto z-20">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-light mb-6 text-gray-900 dark:text-white">The <span className="text-blue-600 dark:text-blue-500">Invisible</span> Workforce</h2>
                <p className="sub-heading max-w-2xl mx-auto text-gray-600 dark:text-white/70">LayerSync replaces your "Busy Work" with intelligent, tireless agents that run 24/7.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-black/5 dark:bg-white/10 -translate-y-1/2 z-0" />

                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.2, type: "spring" }}
                            className="relative z-10 flex flex-col items-center gap-6 p-6"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${step.color} bg-opacity-20 flex items-center justify-center text-white border border-black/10 dark:border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm group hover:scale-110 transition-transform duration-300`}>
                                <div className={`${step.color} w-full h-full absolute inset-0 opacity-20 blur-xl rounded-2xl group-hover:opacity-40 transition-opacity`} />
                                {step.icon}
                            </div>
                            <div className="text-center">
                                <div className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-white mb-1">Step 0{i + 1}</div>
                                <div className="text-lg text-gray-900 dark:text-white">{step.label}</div>
                            </div>
                        </motion.div>

                        {i < steps.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 + 0.1 }}
                                className="md:hidden"
                            >
                                <ArrowRight className="w-6 h-6 text-black/20 dark:text-white/20 rotate-90" />
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}

                {/* Animated Particles */}
                <motion.div
                    className="hidden md:block absolute top-1/2 left-0 w-4 h-4 bg-white rounded-full z-20 shadow-[0_0_20px_white]"
                    animate={{ left: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ translateY: "-50%" }}
                />
                <motion.div
                    className="hidden md:block absolute top-1/2 left-0 w-4 h-4 bg-blue-500 rounded-full z-20 shadow-[0_0_20px_#3b82f6]"
                    animate={{ left: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                    style={{ translateY: "-50%" }}
                />
            </div>

            <div className="mt-20 text-center">
                <p className="text-sm opacity-50 mb-4">Zero Human Intervention Required</p>
            </div>
        </section>
    );
};
