import React from 'react';

interface LogoProps {
  className?: string;
  isDarkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", isDarkMode = true }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B4CFF" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
    </defs>
    <path 
      d="M25 30C25 25 30 20 45 20H65C80 20 85 25 85 30V40C85 45 80 50 65 50H45C30 50 25 55 25 60V70C25 75 30 80 45 80H65C80 80 85 75 85 70" 
      stroke="url(#logoGradient)" 
      strokeWidth="7" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M35 40H75M35 60H75" 
      stroke={isDarkMode ? "white" : "black"} 
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);