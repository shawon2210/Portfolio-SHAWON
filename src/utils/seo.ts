import { TabType, Project } from '../types';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  jsonLd: Record<string, any>;
}

export type ProjectCategoryKey = 'all' | 'fullstack' | 'aiml' | 'backend';

/**
 * Metadata presets for specific project categories to boost search engine indexing,
 * social snippet relevancy, and deep-link CTR.
 */
export const PROJECT_CATEGORY_SEO: Record<ProjectCategoryKey, {
  title: string;
  description: string;
  keywords: string[];
  categoryName: string;
}> = {
  all: {
    categoryName: 'Engineered Systems & Full-Stack Projects',
    title: 'Engineered Projects & Systems Architecture | MD Shawon Molla',
    description: 'Explore high-scale full-stack projects, autonomous AI pipelines, and distributed cloud applications built with mathematical precision.',
    keywords: [
      'MD Shawon Molla Projects',
      'Software Engineering Portfolio',
      'Full-Stack Architecture',
      'Autonomous AI Systems',
      'Distributed Systems',
      'Production Web Applications'
    ]
  },
  fullstack: {
    categoryName: 'Full-Stack Web Systems',
    title: 'Full-Stack Web Systems & Applications | MD Shawon Molla',
    description: 'Production-grade full-stack architectures, high-concurrency platforms, responsive React interfaces, and cloud-native Node.js services.',
    keywords: [
      'Full-Stack Developer',
      'React TypeScript',
      'Node.js Architect',
      'PostgreSQL',
      'Next.js Vite',
      'Full-Stack Web Applications',
      'MD Shawon Molla Full-Stack'
    ]
  },
  aiml: {
    categoryName: 'Autonomous AI & Machine Learning Systems',
    title: 'Autonomous AI & ML Systems, RAG Pipelines | MD Shawon Molla',
    description: 'Discover autonomous AI agents, LangChain RAG architectures, LLM multi-agent systems, and production machine learning pipelines.',
    keywords: [
      'AI Software Engineer',
      'LangChain RAG Pipelines',
      'Autonomous AI Agents',
      'LLM Integration',
      'Machine Learning Systems',
      'Python AI Architect',
      'MD Shawon Molla AI'
    ]
  },
  backend: {
    categoryName: 'Backend & Distributed SaaS Architectures',
    title: 'Backend Architecture & Distributed Systems | MD Shawon Molla',
    description: 'High-throughput microservices, resilient database schemas, fault-tolerant APIs, and distributed cloud architectures.',
    keywords: [
      'Backend Engineer',
      'Distributed Systems',
      'Microservices Architecture',
      'High-Throughput APIs',
      'Database Optimization',
      'SaaS Infrastructure',
      'MD Shawon Molla Backend'
    ]
  }
};

/**
 * Section-level metadata configurations for the primary scroll-spy sections.
 */
export const SECTION_SEO: Record<TabType, {
  title: string;
  description: string;
  keywords: string[];
}> = {
  home: {
    title: 'MD Shawon Molla | Software Engineer & Systems Architect',
    description: 'Official portfolio of MD Shawon Molla. Engineering high-concurrency full-stack platforms, autonomous AI pipelines, and distributed databases.',
    keywords: [
      'MD Shawon Molla',
      'Software Engineer',
      'Systems Architect',
      'Full-Stack Developer',
      'AI Engineer',
      'Dhaka Bangladesh Software Engineer',
      'Web Systems Engineering'
    ]
  },
  projects: {
    title: PROJECT_CATEGORY_SEO.all.title,
    description: PROJECT_CATEGORY_SEO.all.description,
    keywords: PROJECT_CATEGORY_SEO.all.keywords
  },
  experience: {
    title: 'Work Experience & Engineering Milestones | MD Shawon Molla',
    description: 'Review professional software engineering experience, production deployments, system performance milestones, and technical leadership.',
    keywords: [
      'MD Shawon Molla Experience',
      'Software Engineering Career',
      'Tech Lead Full-Stack',
      'Production Deployments',
      'Enterprise Software Experience'
    ]
  },
  contact: {
    title: 'Contact & Collaboration | MD Shawon Molla - Software Engineer',
    description: 'Connect with MD Shawon Molla for full-time software engineering roles, autonomous AI implementations, and systems architecture consultations.',
    keywords: [
      'Contact MD Shawon Molla',
      'Hire Software Engineer',
      'Hire Full-Stack Developer',
      'Software Engineer Dhaka',
      'Autonomous AI Consulting'
    ]
  }
};

/**
 * Utility to set or create a <meta> element in <head>.
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Utility to set or create a <link> element in <head>.
 */
function setLinkTag(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Utility to set or update Schema.org JSON-LD structured data in <head>.
 */
function setJsonLd(data: Record<string, any>): void {
  if (typeof document === 'undefined') return;
  const scriptId = 'seo-structured-data';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Resolve canonical absolute URL for the current window location.
 */
function getCanonicalUrl(hashFragment?: string): string {
  if (typeof window === 'undefined') return 'https://shawon.dev';
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}${hashFragment ? `#${hashFragment}` : ''}`;
}

/**
 * Builds Schema.org structured data tailored to the active section and project category.
 */
function buildStructuredData(section: TabType, projectCategory?: string): Record<string, any> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shawon.dev';

  const basePerson = {
    '@type': 'Person',
    name: 'MD Shawon Molla',
    jobTitle: 'Software Engineer & Systems Architect',
    url: baseUrl,
    sameAs: [
      'https://github.com/shawon2210',
      'https://linkedin.com/in/shawon',
      'https://oddboundary.lovable.app'
    ],
    knowsAbout: [
      'Full-Stack Web Development',
      'Distributed Systems Architecture',
      'Autonomous AI & LangChain RAG',
      'TypeScript & React',
      'Node.js & Python'
    ]
  };

  if (section === 'projects') {
    const catKey = (projectCategory as ProjectCategoryKey) || 'all';
    const catInfo = PROJECT_CATEGORY_SEO[catKey] || PROJECT_CATEGORY_SEO.all;

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: catInfo.title,
      description: catInfo.description,
      url: `${baseUrl}/#projects`,
      about: {
        '@type': 'Thing',
        name: catInfo.categoryName
      },
      creator: basePerson,
      inLanguage: 'en-US'
    };
  }

  if (section === 'experience') {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: SECTION_SEO.experience.title,
      description: SECTION_SEO.experience.description,
      url: `${baseUrl}/#experience`,
      mainEntity: basePerson
    };
  }

  if (section === 'contact') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: SECTION_SEO.contact.title,
      description: SECTION_SEO.contact.description,
      url: `${baseUrl}/#contact`,
      mainEntity: basePerson
    };
  }

  // Default: WebSite & ProfilePage
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: SECTION_SEO.home.title,
    description: SECTION_SEO.home.description,
    url: baseUrl,
    mainEntity: basePerson
  };
}

/**
 * Helper function to dynamically update document title and meta tags based on
 * the active section in the scroll-spy, with specialized SEO optimization for
 * project categories (Full-Stack, AI/ML, Backend/SaaS).
 *
 * @param section The active section detected by the scroll-spy ('home' | 'projects' | 'experience' | 'contact')
 * @param projectCategory Optional active project category ('all' | 'fullstack' | 'aiml' | 'backend')
 * @param customMeta Optional overrides for specific attributes
 */
export function updateSectionSEO(
  section: TabType,
  projectCategory?: string,
  customMeta?: Partial<SEOConfig>
): void {
  if (typeof document === 'undefined') return;

  let title = SECTION_SEO[section]?.title || SECTION_SEO.home.title;
  let description = SECTION_SEO[section]?.description || SECTION_SEO.home.description;
  let keywords = SECTION_SEO[section]?.keywords || SECTION_SEO.home.keywords;
  let hashFragment = section === 'home' ? '' : section;

  // If in projects section, tailor SEO directly to the active category
  if (section === 'projects' && projectCategory && projectCategory in PROJECT_CATEGORY_SEO) {
    const cat = projectCategory as ProjectCategoryKey;
    title = PROJECT_CATEGORY_SEO[cat].title;
    description = PROJECT_CATEGORY_SEO[cat].description;
    keywords = PROJECT_CATEGORY_SEO[cat].keywords;
    hashFragment = cat === 'all' ? 'projects' : `projects?category=${cat}`;
  }

  // Apply custom overrides if provided
  if (customMeta?.title) title = customMeta.title;
  if (customMeta?.description) description = customMeta.description;
  if (customMeta?.keywords) keywords = customMeta.keywords;

  const canonicalUrl = customMeta?.canonicalUrl || getCanonicalUrl(hashFragment);

  // 1. Update Document Title
  document.title = title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords.join(', '));
  setMetaTag('name', 'author', 'MD Shawon Molla');

  // 3. OpenGraph Social Cards
  setMetaTag('property', 'og:title', customMeta?.ogTitle || title);
  setMetaTag('property', 'og:description', customMeta?.ogDescription || description);
  setMetaTag('property', 'og:url', customMeta?.ogUrl || canonicalUrl);
  setMetaTag('property', 'og:type', customMeta?.ogType || 'website');
  setMetaTag('property', 'og:site_name', 'Shawon.dev - Portfolio');

  // 4. Twitter / X Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', customMeta?.twitterTitle || title);
  setMetaTag('name', 'twitter:description', customMeta?.twitterDescription || description);
  setMetaTag('name', 'twitter:url', canonicalUrl);

  // 5. Canonical Link
  setLinkTag('canonical', canonicalUrl);

  // 6. Schema.org JSON-LD Structured Data
  const jsonLdData = customMeta?.jsonLd || buildStructuredData(section, projectCategory);
  setJsonLd(jsonLdData);
}

/**
 * Specialized SEO updater for individual Project detail view or modal.
 * Generates rich SoftwareApplication schema and indexable metadata.
 */
export function updateProjectSEO(project: Project): void {
  if (typeof document === 'undefined') return;

  const title = `${project.title} – Architecture Case Study | MD Shawon Molla`;
  const description = project.tagline || `Technical architecture, benchmark metrics, and stack analysis for ${project.title} by MD Shawon Molla.`;
  const keywords = [
    project.title,
    ...project.techStack,
    project.category,
    'Software Architecture Case Study',
    'MD Shawon Molla'
  ];

  const canonicalUrl = getCanonicalUrl(`projects/${project.id}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    operatingSystem: 'Web, Cloud',
    applicationCategory: project.category === 'aiml'
      ? 'ArtificialIntelligenceApplication'
      : project.category === 'backend'
      ? 'DeveloperApplication'
      : 'WebApplication',
    description: project.tagline,
    author: {
      '@type': 'Person',
      name: 'MD Shawon Molla'
    },
    url: project.liveUrl || canonicalUrl
  };

  updateSectionSEO('projects', project.category, {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDescription: description,
    jsonLd
  });
}
