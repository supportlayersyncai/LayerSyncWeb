import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { EnterpriseHero } from '../components/enterprise/EnterpriseHero';
import { OrgTransformation } from '../components/enterprise/OrgTransformation';
import { AgentArchitecture } from '../components/enterprise/AgentArchitecture';
import { EnterpriseAgents } from '../components/enterprise/EnterpriseAgents';
import { SecurityCompliance } from '../components/enterprise/SecurityCompliance';
import { EnterpriseROI } from '../components/enterprise/ROIProjection';
import { ImplementationRoadmap } from '../components/enterprise/ImplementationRoadmap';
import { ArrowRight } from 'lucide-react';

export const Enterprise: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#020a08]' : 'bg-[#f5fbf9]'}`}>
            <EnterpriseHero />

            <div className="relative">
                <div className={`absolute top-0 left-0 w-full h-[150px] transition-colors duration-700 z-10 pointer-events-none ${safeDarkMode ? 'bg-gradient-to-b from-[#020a08] to-transparent' : 'bg-gradient-to-b from-[#f5fbf9] to-transparent'}`} />

                <OrgTransformation />
                
                <SecurityCompliance />

                <AgentArchitecture />

                <EnterpriseAgents />
                
                <div className="py-10">
                    <EnterpriseROI />
                </div>

                <ImplementationRoadmap />

                {/* Final CTA */}
                <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-5xl mx-auto z-20">
                    <div className={`glass-card rounded-[40px] md:rounded-[64px] p-10 md:p-20 border text-center relative overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-emerald-600/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className={`hero-heading mb-8 text-shimmer`}>Design Your <span className="italic">Private AI</span> Operating System</h3>
                            <p className={`sub-heading mb-12 max-w-2xl mx-auto`}>Book a 90-minute architecture review with our enterprise team. We'll scope your deployment, model your projected ROI, and map a compliance-ready rollout — at zero obligation.</p>
                            <button className="btn-glow px-10 md:px-14 py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs shadow-2xl inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white cursor-pointer">
                                Schedule Enterprise Assessment <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
