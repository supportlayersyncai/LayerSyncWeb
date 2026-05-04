import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Lock, Server, Key, FileText, Eye } from 'lucide-react';

const features = [
    { icon: <ShieldCheck />, title: "SOC 2 Type II", desc: "Audited and certified for enterprise-grade security and availability." },
    { icon: <Lock />, title: "End-to-End Encryption", desc: "AES-256 encryption at rest and TLS 1.3 in transit." },
    { icon: <Server />, title: "On-Prem Deployment", desc: "Option to deploy models entirely within your VPC." },
    { icon: <Key />, title: "Role-Based Access", desc: "Granular permissions and SSO integration (SAML/OIDC)." },
    { icon: <FileText />, title: "Zero Data Retention", desc: "LLMs do not train on your proprietary enterprise data." },
    { icon: <Eye />, title: "Audit Logging", desc: "Comprehensive logs of every agent action and API call." },
];

export const SecurityCompliance: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <div className={`inline-flex items-center gap-2 mb-6 py-2 px-6 rounded-full border text-[10px] uppercase tracking-[0.3em] font-bold ${safeDarkMode ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-emerald-500/20 bg-emerald-50 text-emerald-600'}`}>
                        Bank-Grade Security
                    </div>
                    <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Secure by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Design</span>
                    </h2>
                    <p className={`sub-heading mb-10 ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        We built LayerSync with enterprise security requirements first. Your proprietary data never leaves your environment or trains public models.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${safeDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {React.cloneElement(feature.icon as React.ReactElement, { className: 'w-5 h-5' })}
                                </div>
                                <div>
                                    <h4 className={`font-bold mb-1 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
                                    <p className={`text-xs leading-relaxed ${safeDarkMode ? 'text-white/50' : 'text-gray-600'}`}>{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-[100px]" />
                    <div className={`glass-card rounded-[32px] p-8 border relative z-10 ${safeDarkMode ? 'border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl' : 'border-black/5 bg-white/80 backdrop-blur-xl'}`}>
                        {/* Mock Security Dashboard */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10 dark:border-white/10 border-black/10">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                <div>
                                    <div className={`text-sm font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Posture</div>
                                    <div className="text-emerald-500 text-xs font-medium">100% Compliant</div>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-bold animate-pulse">ACTIVE</div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Data Encryption", status: "AES-256 Enabled" },
                                { label: "Access Control", status: "Strict (SSO Enforced)" },
                                { label: "Model Training", status: "Disabled (Zero Retention)" },
                                { label: "VPC Peering", status: "Connected" }
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${safeDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                    <span className={`text-xs font-medium ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{item.label}</span>
                                    <span className={`text-xs font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
