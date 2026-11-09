import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, BellRing, Inbox, Plug } from 'lucide-react';

/**
 * "Every site comes with a dashboard": SyncSite (the /dashboard app in this
 * repo). Plain description only; no sample numbers or mock screenshots, per
 * the no-fabricated-proof rule in docs/DESIGN-TOKENS.md.
 */

const points = [
    {
        icon: BarChart3,
        title: 'Who visits, and from where',
        desc: 'Visitors, the pages they read, how long they stay, and whether they came from Google, Instagram, WhatsApp or a campaign link.',
    },
    {
        icon: Inbox,
        title: 'Every enquiry in one inbox',
        desc: 'Each form your site receives lands in a simple pipeline, with what the person read before getting in touch. No digging through email.',
    },
    {
        icon: BellRing,
        title: 'Told the moment it happens',
        desc: 'An email and a notification on your phone when someone gets in touch, and a short summary every Monday.',
    },
    {
        icon: Plug,
        title: 'Connects to what you use',
        desc: 'Send leads to your CRM, Zapier or Make, or ask an AI assistant like Claude how the site did this week.',
    },
];

export const DashboardSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className="text-center mb-14 md:mb-16"
            >
                <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                    Included with every site
                </span>
                <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your site, with a{' '}
                    <span className="text-shimmer">dashboard</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    You get a login of your own that shows how the website is doing and everyone who has
                    got in touch through it. No cookies or cookie banners needed.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {points.map((p, index) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.45, delay: index * 0.06 }}
                        className="glass-card rounded-[24px] p-7 flex gap-5"
                    >
                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'}`}>
                            <p.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{p.title}</h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/45' : 'text-gray-500'}`}>{p.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
