import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { RealEstateHero } from '../components/real-estate/Hero';
import { RealEstateFeatures } from '../components/real-estate/BeforeAfter';
import { AgentPipeline } from '../components/real-estate/AgentPipeline';
import { VirtualStagingGallery } from '../components/real-estate/VirtualStagingGallery';
import { ListingCopyDemo } from '../components/real-estate/ListingCopyDemo';
import { ChatbotViz } from '../components/real-estate/ChatbotViz';
import { IntegrationMap } from '../components/real-estate/IntegrationMap';
import { RETestimonials } from '../components/real-estate/RETestimonials';
import { ArrowRight } from 'lucide-react';

export const RealEstate: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            <RealEstateHero />

            <div className="relative">
                <div className={`absolute top-0 left-0 w-full h-[150px] transition-colors duration-700 z-10 pointer-events-none ${safeDarkMode ? 'bg-gradient-to-b from-[#050505] to-transparent' : 'bg-gradient-to-b from-[#f5f5f7] to-transparent'}`} />

                <AgentPipeline />

                <div className="px-0 sm:px-6">
                    <RealEstateFeatures />
                </div>

                <VirtualStagingGallery />

                <ListingCopyDemo />

                <ChatbotViz />

                <IntegrationMap />

                <RETestimonials />

                {/* Final CTA */}
                <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-5xl mx-auto z-20">
                    <div className={`glass-card rounded-[40px] md:rounded-[64px] p-10 md:p-20 border text-center relative overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-purple-600/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className={`hero-heading mb-8 text-shimmer`}>Be One of the <span className="italic">First</span> Agencies Running SynCRM.</h3>
                            <p className={`sub-heading mb-12 max-w-2xl mx-auto`}>SynCRM launches in Q2 2026, and we're onboarding a select group of founding agencies now. Lock in exclusive early-adopter pricing, dedicated onboarding, and a direct line into the product roadmap.</p>
                            <button className="btn-glow px-10 md:px-14 py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs shadow-2xl inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer">
                                Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
