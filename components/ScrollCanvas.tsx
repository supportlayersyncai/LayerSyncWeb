import React, { useRef, useEffect, useState } from 'react';
import { useSpring, MotionValue } from 'framer-motion';

interface ScrollCanvasProps {
  isDarkMode: boolean;
  scrollYProgress: MotionValue<number>;
}

export const ScrollCanvas: React.FC<ScrollCanvasProps> = ({ isDarkMode, scrollYProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    // Artificial preloader to simulate asset readiness
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const render = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Only update canvas size if it changed
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDarkMode ? '#050505' : '#f5f5f7';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const layerCount = 5;
    const layerSpacing = height * 0.15;
    const alignment = Math.pow(progress, 1.2);

    for (let i = 0; i < layerCount; i++) {
      const depth = (i - (layerCount - 1) / 2);
      const verticalOffset = depth * (layerSpacing * (1 - alignment * 0.95));
      const rotation = (1 - alignment) * (depth * 0.15);
      const driftX = (1 - alignment) * (depth * 50);
      
      ctx.save();
      ctx.translate(centerX + driftX, centerY + verticalOffset);
      ctx.rotate(rotation);

      const radius = Math.min(width * 0.12, 160);
      const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, `rgba(107, 76, 255, ${0.1 + alignment * 0.2})`);
      gradient.addColorStop(1, `rgba(34, 211, 238, ${0.1 + alignment * 0.2})`);

      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (Math.PI / 3) * j;
        const x = radius * Math.cos(angle);
        const y = (radius * 0.45) * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = `rgba(56, 232, 255, ${0.1 + alignment * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (alignment > 0.5) {
        const pulse = Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 4 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#38E8FF';
        ctx.fill();
      }

      ctx.restore();
    }
  };

  useEffect(() => {
    let frame: number;
    const loop = () => {
      render(smoothProgress.get());
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [smoothProgress, isDarkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }}
    />
  );
};