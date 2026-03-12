import React from 'react';
import { HeroSection } from '../components/web-dev/HeroSection';
import { ProblemSection } from '../components/web-dev/ProblemSection';
import { TransformationSection } from '../components/web-dev/TransformationSection';
import { WhyUsSection } from '../components/web-dev/WhyUsSection';
import { ServicesSection } from '../components/web-dev/ServicesSection';
import { LaptopCarousel } from '../components/web-dev/LaptopCarousel';
import { BusinessImpactSection } from '../components/web-dev/BusinessImpactSection';
import { ProcessSection } from '../components/web-dev/ProcessSection';
import { TechStack } from '../components/web-dev/TechStack';
import { FAQSection } from '../components/web-dev/FAQSection';
import { FinalCTASection } from '../components/web-dev/FinalCTASection';

import { useOutletContext } from 'react-router-dom';

export const WebDev: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <div className={`min-h-screen pb-20 pt-24 md:pt-32 overflow-x-hidden transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
            {/* 1. Hero */}
            <HeroSection isDarkMode={safeDarkMode} />

            {/* 2. Problem */}
            <ProblemSection isDarkMode={safeDarkMode} />

            {/* 3. Transformation */}
            <TransformationSection isDarkMode={safeDarkMode} />

            {/* 4. Why LayerSync AI */}
            <WhyUsSection isDarkMode={safeDarkMode} />

            {/* Portfolio showcase - retained from original */}
            <LaptopCarousel isDarkMode={safeDarkMode} />

            {/* 5. What We Offer */}
            <ServicesSection isDarkMode={safeDarkMode} />

            {/* 6. Business Impact */}
            <BusinessImpactSection isDarkMode={safeDarkMode} />

            {/* 7. Process */}
            <ProcessSection isDarkMode={safeDarkMode} />

            {/* Tech stack - retained from original */}
            <TechStack />

            {/* 8. FAQ */}
            <FAQSection isDarkMode={safeDarkMode} />

            {/* 9. Final CTA */}
            <FinalCTASection isDarkMode={safeDarkMode} />
        </div>
    );
};
