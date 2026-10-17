import { TabType, Project } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { siteOrigin } from '../config/site';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  ogImage?: string;
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
    description: 'Explore high-scale full-stack projects, autonomous AI pipelines, and distributed cloud applications built for production use.',
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
      'Vite',
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
    title: 'MD Shawon Molla | Full-Stack Engineer, Product Systems & AI',
    description:
      'Full-stack engineer building resilient product systems, AI workflows, and scalable web experiences for real users.',
    keywords: [
      'MD Shawon Molla',
      'Full-Stack Engineer',
      'AI Product Systems',
      'Product Engineer',
      'Software Engineer',
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
    title: 'Contact & Collaboration | MD Shawon Molla - Full-Stack Engineer, Product Systems & AI',
    description: 'Get in touch with MD Shawon Molla about full-time software engineering roles, contract or milestone projects, and collaboration.',
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
  if (typeof window === 'undefined') return siteOrigin;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}${hashFragment ? `#${hashFragment}` : ''}`;
}

/**
 * PHASE 5: absolute origin for social assets.
 * `og:image` must be an absolute URL — a relative one is dropped by most
 * crawlers, so this falls back to the canonical production host.
 */
function getOrigin(): string {
  if (typeof window === 'undefined') return siteOrigin;
  return window.location.origin === 'null'
    ? siteOrigin
    : window.location.origin;
}

/**
 * Builds Schema.org structured data tailored to the active section and project category.
 *
 * PHASE 5: every payload is emitted as a single `@graph` document so crawlers get
 * one connected entity graph (WebSite -> WebPage -> Person) instead of a series of
 * disconnected single-object scripts. Person facts (job title, sameAs, knowsAbout,
 * alumniOf, knowsLanguage) are hoisted onto the `Person` node that every section
 * references by `@id`, which is how Google expects authorship to be expressed.
 */
function buildStructuredData(section: TabType, projectCategory?: string): Record<string, any> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : siteOrigin;
  const origin = siteOrigin;

  const PERSON_ID = `${origin}/#person`;
  const WEBSITE_ID = `${origin}/#website`;

  const person: Record<string, any> = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'MD Shawon Molla',
    alternateName: 'Shawon Molla',
    givenName: 'Shawon',
    familyName: 'Molla',
    jobTitle: PERSONAL_INFO.title,
    description:
      'Full-stack engineer building resilient product systems, AI workflows, and scalable web experiences for real users.',
    url: `${origin}/`,
    image: `${origin}/og-image.png`,
    email: 'mailto:22103330@iubat.edu',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    knowsLanguage: ['en', 'bn'],
    knowsAbout: [
      'Full-Stack Web Development',
      'Distributed Systems Architecture',
      'Autonomous AI & LangChain RAG',
      'TypeScript & React',
      'Node.js & Python',
      'PostgreSQL & Prisma',
      'Three.js / WebGL',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Independent University, Bangladesh',
    },
    sameAs: [
      'https://github.com/shawon2210',
      'https://linkedin.com/in/md-shawon-molla-2a3877293',
    ],
  };

  const website: Record<string, any> = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${origin}/`,
    name: 'Shawon.dev',
    alternateName: 'shawon.dev',
    description:
      'Full-stack engineer building resilient product systems, AI workflows, and scalable web experiences for real users.',
    inLanguage: 'en-US',
    publisher: { '@id': PERSON_ID },
  };

  const wrap = (pageType: string, node: Record<string, any>, title: string, description: string, url: string) => ({
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': pageType,
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        inLanguage: 'en-US',
        ...node,
      },
    ],
  });

  if (section === 'projects') {
    const catKey = (projectCategory as ProjectCategoryKey) || 'all';
    const catInfo = PROJECT_CATEGORY_SEO[catKey] || PROJECT_CATEGORY_SEO.all;
    const url = `${origin}/#projects`;
    return wrap(
      'CollectionPage',
      {
        mainEntity: {
          '@type': 'ItemList',
          name: catInfo.categoryName,
          numberOfItems: 3,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'AmarShop' },
            { '@type': 'ListItem', position: 2, name: 'SupportPilot AI' },
            { '@type': 'ListItem', position: 3, name: 'Online24Pharmacy' },
          ],
        },
      },
      catInfo.title,
      catInfo.description,
      url
    );
  }

  if (section === 'experience') {
    return wrap(
      'AboutPage',
      { mainEntity: { '@id': PERSON_ID } },
      SECTION_SEO.experience.title,
      SECTION_SEO.experience.description,
      `${origin}/#experience`
    );
  }

  if (section === 'contact') {
    return wrap(
      'ContactPage',
      { mainEntity: { '@id': PERSON_ID } },
      SECTION_SEO.contact.title,
      SECTION_SEO.contact.description,
      `${origin}/#contact`
    );
  }

  return wrap(
    'ProfilePage',
    { mainEntity: { '@id': PERSON_ID }, datePublished: '2024-01-01' },
    SECTION_SEO.home.title,
    SECTION_SEO.home.description,
    `${origin}/`
  );
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
  //    PHASE 5: the og:image contract is completed here (secure_url, type,
  //    alt, locale, width/height) so every section renders the same 1200×630
  //    card, and the card is refreshed as content changes.
  const ogImage = customMeta?.ogImage ?? `${getOrigin()}/og-image.png`;
  setMetaTag('property', 'og:title', customMeta?.ogTitle || title);
  setMetaTag('property', 'og:description', customMeta?.ogDescription || description);
  setMetaTag('property', 'og:url', customMeta?.ogUrl || canonicalUrl);
  setMetaTag('property', 'og:type', customMeta?.ogType || 'website');
  setMetaTag('property', 'og:site_name', 'Shawon.dev — MD Shawon Molla');
  setMetaTag('property', 'og:locale', 'en_US');
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:image:secure_url', ogImage);
  setMetaTag('property', 'og:image:type', 'image/png');
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag(
    'property',
    'og:image:alt',
    `MD Shawon Molla — ${PERSONAL_INFO.title}. Full-stack platforms, distributed services, and AI orchestration.`
  );

  // 4. Twitter / X Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', customMeta?.twitterTitle || title);
  setMetaTag('name', 'twitter:description', customMeta?.twitterDescription || description);
  setMetaTag('name', 'twitter:url', canonicalUrl);
  setMetaTag('name', 'twitter:image', ogImage);
  setMetaTag('name', 'twitter:image:alt', 'Shawon.dev — software engineering portfolio');

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

  const origin = getOrigin();
  const title = `${project.title} – Architecture Case Study | MD Shawon Molla`;
  const description =
    project.tagline ||
    `Technical architecture, benchmark metrics, and stack analysis for ${project.title} by MD Shawon Molla.`;
  const keywords = [
    project.title,
    ...project.techStack,
    project.category,
    'Software Architecture Case Study',
    'MD Shawon Molla'
  ];

  const canonicalUrl = getCanonicalUrl(`projects/${project.id}`);

  /* PHASE 5: a full SoftwareApplication node instead of the previous
     four-field stub — screenshots, creator, and the tech stack are what make a
     project rich result eligible in Google and what make the card informative
     when shared on LinkedIn / Slack. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${origin}/#person`,
        name: 'MD Shawon Molla',
        jobTitle: PERSONAL_INFO.title,
        url: `${origin}/`,
        sameAs: ['https://github.com/shawon2210', 'https://linkedin.com/in/md-shawon-molla-2a3877293'],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#app`,
        name: project.title,
        url: project.liveUrl || canonicalUrl,
        description,
        applicationCategory:
          project.category === 'aiml'
            ? 'ArtificialIntelligenceApplication'
            : project.category === 'backend'
            ? 'DeveloperApplication'
            : 'WebApplication',
        operatingSystem: 'Web, Cloud',
        softwareRequirements: project.techStack.join(', '),
        programmingLanguage: project.techStack.filter((t) =>
          /TypeScript|JavaScript|Python|SQL|Go|Rust/i.test(t)
        ),
        author: { '@id': `${origin}/#person` },
        creator: { '@id': `${origin}/#person` },
        featureList: project.highlights?.slice(0, 5).map((h) => h.title ?? String(h)),
        ...(project.imageUrl
          ? {
              image: project.imageUrl,
              screenshot: project.imageUrl,
            }
          : {}),
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: { '@id': `${origin}/#website` },
        mainEntity: { '@id': `${canonicalUrl}#app` },
        about: { '@id': `${origin}/#person` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'Shawon.dev',
        publisher: { '@id': `${origin}/#person` },
      },
    ],
  };

  updateSectionSEO('projects', project.category, {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogType: 'article',
    twitterTitle: title,
    twitterDescription: description,
    // Prefer the project's own screenshot as the social card; fall back to the
    // site card when a project still has no asset.
    ogImage: project.imageUrl || `${origin}/og-image.png`,
    jsonLd
  });
}
