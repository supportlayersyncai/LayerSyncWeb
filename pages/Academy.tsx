import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AcademyHero } from '../components/academy/AcademyHero';
import { ProblemGap } from '../components/academy/ProblemGap';
import { DepartmentTracks } from '../components/academy/DepartmentTracks';
import { HowItWorks } from '../components/academy/HowItWorks';
import { WhyAcademy } from '../components/academy/WhyAcademy';
import { WhoIsItFor } from '../components/academy/WhoIsItFor';

export const Academy: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            <AcademyHero />

            <div className="relative">
                <div className={`absolute top-0 left-0 w-full h-[150px] transition-colors duration-700 z-10 pointer-events-none ${safeDarkMode ? 'bg-gradient-to-b from-[#050505] to-transparent' : 'bg-gradient-to-b from-[#f5f5f7] to-transparent'}`} />

                <ProblemGap />
                <DepartmentTracks />
                <HowItWorks />
                <WhyAcademy />
                <WhoIsItFor />
                
            </div>
        </div>
    );
};
