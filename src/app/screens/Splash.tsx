import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/5b2d9091f7a7317c82c2d3491c2fef51e9ebdb76.png';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--gulper-green)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1]
        }}
        className="text-center"
      >
        <img 
          src={logoImage} 
          alt="Gulper" 
          className="w-64 mx-auto"
        />
      </motion.div>
    </div>
  );
}