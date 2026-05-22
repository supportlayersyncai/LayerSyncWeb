import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SMBHero } from '../components/smb/SMBHero';
import { PainPoints } from '../components/smb/PainPoints';
import { AgentShowcase } from '../components/smb/AgentShowcase';
import { DeploymentTimeline } from '../components/smb/DeploymentTimeline';
import { IntegrationGrid } from '../components/smb/IntegrationGrid';
import { SMBCalculator } from '../components/smb/SMBCalculator';
import { SMBTestimonials } from '../components/smb/SMBTestimonials';
import { ArrowRight } from 'lucide-react';

export const SMB: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            <SMBHero />

            <div className="relative">
                <div className={`absolute top-0 left-0 w-full h-[150px] transition-colors duration-700 z-10 pointer-events-none ${safeDarkMode ? 'bg-gradient-to-b from-[#050505] to-transparent' : 'bg-gradient-to-b from-[#f5f5f7] to-transparent'}`} />

                <PainPoints />

                <AgentShowcase />

                <DeploymentTimeline />
                
                <IntegrationGrid />

                <div className="py-20">
                    <SMBCalculator />
                </div>

                <SMBTestimonials />

                {/* Final CTA */}
                <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-5xl mx-auto z-20">
                    <div className={`glass-card rounded-[40px] md:rounded-[64px] p-10 md:p-20 border text-center relative overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-600/5 to-blue-600/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className={`hero-heading mb-8 text-shimmer`}>Stop Paying Humans to Do <span className="italic">Machine Work.</span></h3>
                            <p className={`sub-heading mb-12 max-w-2xl mx-auto`}>A free workflow audit takes 30 minutes. We will show you exactly which tasks AI can take over, how many hours per week you recover, and what the cost savings look like over 12 months. No commitment required.</p>
                            <button className="btn-glow px-10 md:px-14 py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs shadow-2xl inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white cursor-pointer">
                                Request Free Workflow Audit <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
