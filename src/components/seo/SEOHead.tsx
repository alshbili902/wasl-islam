import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BASE_PRODUCTION_URL, 
  DEFAULT_OG_IMAGE, 
  BreadcrumbItem,
  SchemaType,
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildLearningResourceSchema,
  buildCollectionSchema
} from '../../services/seoService';
import { SITE_CONFIG } from '../../config/siteConfig';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: SchemaType;
  schemaData?: Record<string, unknown>;
}

/**
 * Universal Technical SEO & Google Search Optimization Head Component
 * يدير وسوم الرأس، الرابط الأساسي Canonical، والبيانات المنظمة JSON-LD
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage,
  keywords,
  noindex = false,
  breadcrumbs,
  schemaType,
  schemaData,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title.includes(SITE_CONFIG.name)
      ? title
      : `${title} | ${SITE_CONFIG.name} — المنصة الإسلامية`;
    document.title = formattedTitle;

    // 2. Canonical URL (Always absolute HTTPS with preferred domain, normalized)
    const effectivePath = canonicalPath || location.pathname;
    const cleanPath = effectivePath.startsWith('/') ? effectivePath : `/${effectivePath}`;
    const canonicalUrl = `${BASE_PRODUCTION_URL}${cleanPath === '/' ? '' : cleanPath}`;

    updateOrCreateLink('canonical', canonicalUrl);

    // 3. Meta Description
    updateOrCreateMeta('name', 'description', description);

    // 4. Meta Robots
    const robotsDirective = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    updateOrCreateMeta('name', 'robots', robotsDirective);
    updateOrCreateMeta('name', 'googlebot', robotsDirective);

    // 5. Meta Keywords
    if (keywords && keywords.length > 0) {
      updateOrCreateMeta('name', 'keywords', keywords.join(', '));
    }

    // 6. Open Graph Tags
    const finalOgImage = ogImage || DEFAULT_OG_IMAGE;
    updateOrCreateMeta('property', 'og:title', formattedTitle);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:url', canonicalUrl);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:image', finalOgImage);
    updateOrCreateMeta('property', 'og:site_name', SITE_CONFIG.name);
    updateOrCreateMeta('property', 'og:locale', 'ar_SA');

    // 7. Twitter / X Cards
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', formattedTitle);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', finalOgImage);

    // 8. JSON-LD Structured Data
    injectStructuredData({
      title: formattedTitle,
      description,
      canonicalUrl,
      finalOgImage,
      breadcrumbs,
      schemaType,
      schemaData,
      isHome: effectivePath === '/',
    });
  }, [
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
    location.pathname,
  ]);

  return null;
};

/**
 * Update or create a <meta> element in document.head
 */
function updateOrCreateMeta(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Update or create a <link rel="..."> element in document.head
 */
function updateOrCreateLink(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Inject or replace JSON-LD structured data script
 */
function injectStructuredData(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  finalOgImage: string;
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: SEOHeadProps['schemaType'];
  schemaData?: Record<string, unknown>;
  isHome: boolean;
}) {
  const schemaList: Record<string, unknown>[] = [];

  // Always include Organization
  schemaList.push(buildOrganizationSchema());

  // WebSite schema for homepage
  if (params.isHome) {
    schemaList.push(buildWebSiteSchema());
  }

  // Breadcrumbs schema if available
  if (params.breadcrumbs && params.breadcrumbs.length > 0) {
    schemaList.push(buildBreadcrumbSchema(params.breadcrumbs));
  }

  // Specific entity schema
  const schemaTypeLower = params.schemaType?.toLowerCase();
  if (params.schemaData) {
    schemaList.push(params.schemaData);
  } else if (schemaTypeLower === 'article') {
    schemaList.push(
      buildArticleSchema({
        title: params.title,
        description: params.description,
        url: params.canonicalUrl,
        image: params.finalOgImage,
      })
    );
  } else if (schemaTypeLower === 'learningresource' || schemaTypeLower === 'learning') {
    schemaList.push(
      buildLearningResourceSchema({
        name: params.title,
        description: params.description,
        url: params.canonicalUrl,
      })
    );
  } else if (schemaTypeLower === 'collectionpage' || schemaTypeLower === 'collection') {
    schemaList.push(
      buildCollectionSchema({
        name: params.title,
        description: params.description,
        url: params.canonicalUrl,
      })
    );
  }

  const scriptId = 'madar-seo-structured-data';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schemaList.length === 1 ? schemaList[0] : schemaList);
}
