import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { RealEstateFeatures } from '../components/real-estate/BeforeAfter';
import { VirtualStagingGallery } from '../components/real-estate/VirtualStagingGallery';
import { ListingCopyDemo } from '../components/real-estate/ListingCopyDemo';
import { IntegrationMap } from '../components/real-estate/IntegrationMap';
import { ArrowRight, Building2 } from 'lucide-react';
import { CTAButton, GhostLink, Eyebrow, SectionHeader } from '../components/site/Primitives';

/**
 * Real Estate — standalone services page. The product narrative lives on
 * /syncrm; this page covers the real-estate-specific services (staging,
 * listing copy, integrations) and points to SynCRM as the system underneath.
 */
export const RealEstate: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const dark = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            {/* ===== HERO ===== */}
            <section className="relative pt-40 md:pt-56 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
                <div className="ambient-glow absolute top-[10%] right-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <Eyebrow><Building2 className="w-3 h-3" /> For real estate agencies</Eyebrow>
                    <h1 className="hero-heading mb-8 text-shimmer">
                        Everything your agency needs to <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">market and close.</span>
                    </h1>
                    <p className="sub-heading max-w-2xl mx-auto mb-12">
                        Virtual staging, listing copy, and the integrations that keep your tools talking
                        — built around <Link to="/syncrm" className="underline hover:text-brand-orange">SynCRM</Link>, the operating
                        system that gives you a clear view of your whole pipeline.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <CTAButton label="Book a brokerage diagnostic" />
                        <GhostLink to="/syncrm" label="See SynCRM" />
                    </div>
                </div>
            </section>

            <div className="relative">
                {/* AI Virtual Staging (before/after) */}
                <div className="px-0 sm:px-6">
                    <RealEstateFeatures />
                </div>

                <VirtualStagingGallery />

                <ListingCopyDemo />

                <IntegrationMap />

                {/* ===== SYNCRM CROSS-LINK ===== */}
                <section className="relative py-10 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
                    <Link to="/syncrm" className="block group">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card card-hover-glow rounded-[40px] md:rounded-[56px] p-8 md:p-14 border border-black/5 dark:border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-orange rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-14">
                                <div className="w-16 h-16 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-bold mb-3">The system underneath</div>
                                    <h3 className="text-2xl md:text-4xl font-light mb-4 text-gray-900 dark:text-dark-text-primary group-hover:text-shimmer transition-all">Meet SynCRM</h3>
                                    <p className="text-gray-600 dark:text-dark-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
                                        Every lead, agent, and deal in one place — so you stop running blind and finally see your whole pipeline. Marketing tools are great; a system that captures and converts is better.
                                    </p>
                                </div>
                                <div className="hidden lg:flex w-14 h-14 rounded-full border border-black/10 dark:border-white/10 items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 flex-shrink-0">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* ===== REAL PRODUCT PROOF ===== */}
                <section className="py-10 md:py-20 px-4 md:px-6 max-w-6xl mx-auto">
                    <SectionHeader
                        align="center"
                        title={<>The system behind the <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">marketing.</span></>}
                        sub="Staging and listing copy win attention. SynCRM is what makes sure the enquiry actually gets worked — here it is running."
                        className="mb-14"
                    />
                    <Link to="/syncrm" className="block group">
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-[24px] md:rounded-[32px] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative"
                        >
                            <img
                                src="/syncrm-reports.webp"
                                alt="SynCRM agent performance report showing leads assigned, contacted, viewings, offers and conversion rate per agent"
                                loading="lazy"
                                decoding="async"
                                width="1800"
                                height="1058"
                                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-black/85 to-transparent flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-1.5">Live product</div>
                                    <h3 className="text-lg md:text-2xl font-light text-white">Agent performance, per agent</h3>
                                </div>
                                <span className="hidden sm:inline-flex text-[11px] uppercase tracking-[0.2em] font-bold text-white items-center gap-2 whitespace-nowrap">
                                    See SynCRM <ArrowRight className="w-4 h-4 cta-arrow" />
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* ===== FINAL CTA ===== */}
                <section className="relative py-16 md:py-32 px-4 md:px-6 max-w-5xl mx-auto z-20">
                    <div className={`glass-card rounded-[40px] md:rounded-[64px] p-10 md:p-20 border text-center relative overflow-hidden ${dark ? 'border-white/5' : 'border-black/5'}`}>
                        <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-green/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="hero-heading mb-8 text-shimmer">See where your deals are leaking.</h3>
                            <p className="sub-heading mb-12 max-w-2xl mx-auto">
                                We start with a short diagnostic of how leads move through your agency today — and show you exactly where they're slipping. No packages, no pressure.
                            </p>
                            <CTAButton label="Book a brokerage diagnostic" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
