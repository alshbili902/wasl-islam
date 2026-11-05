import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { SEOHead, SEOHeadProps } from '../seo/SEOHead';
import { BreadcrumbItem } from '../../services/seoService';

export interface PageWrapperProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: SEOHeadProps['schemaType'];
  schemaData?: Record<string, unknown>;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  canonicalPath,
  ogType,
  ogImage,
  keywords,
  noindex,
  breadcrumbs,
  schemaType,
  schemaData,
  children,
}) => {
  const { settings } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: settings.reduceMotion ? 'auto' : 'smooth' });
  }, [settings.reduceMotion]);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        ogType={ogType}
        ogImage={ogImage}
        keywords={keywords}
        noindex={noindex}
        breadcrumbs={breadcrumbs}
        schemaType={schemaType}
        schemaData={schemaData}
      />
      {settings.reduceMotion ? (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12 min-w-0">
          {children}
        </main>
      ) : (
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12 min-w-0"
        >
          {children}
        </motion.main>
      )}
    </>
  );
};
