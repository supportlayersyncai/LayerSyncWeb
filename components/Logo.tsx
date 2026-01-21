import React from 'react';

interface LogoProps {
  className?: string;
  isDarkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", isDarkMode = true }) => (
  <img 
    src="/assets/logo.png" 
    alt="LayerSync AI Logo" 
    className={`${className} w-auto object-contain transition-all duration-300 flex-shrink-0`}
    style={{ 
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      imageRendering: 'auto'
    }}
    loading="eager"
    draggable="false"
  />
);