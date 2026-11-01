import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface PageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, description, children }) => {
  const { settings } = useApp();

  useEffect(() => {
    document.title = `${title} | مدار اليقين – Madar Al-Yaqeen`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    window.scrollTo({ top: 0, behavior: settings.reduceMotion ? 'auto' : 'smooth' });
  }, [title, description, settings.reduceMotion]);

  if (settings.reduceMotion) {
    return <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12 min-w-0">{children}</main>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12 min-w-0"
    >
      {children}
    </motion.main>
  );
};

