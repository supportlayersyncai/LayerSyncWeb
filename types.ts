
// Fix: Added React import to resolve 'Cannot find namespace React' error on line 17
import React from 'react';
import { MotionValue } from 'framer-motion';

export interface TextBeatProps {
  title: string;
  subtitle: string;
  scrollYProgress: MotionValue<number>;
  range: [number, number];
  isDarkMode: boolean;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
  features: Array<{ label: string; detail: string }>;
}
