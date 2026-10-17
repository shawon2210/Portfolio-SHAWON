/**
 * Single source of truth for portfolio content.
 *
 * These re-exports point at the existing React app's data layer so the Astro
 * site and the Vite app can never drift apart. Nothing is copied here.
 */
export {
  PERSONAL_INFO,
  PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION_LIST,
  CERTIFICATES,
  SKILL_CATEGORIES,
} from '@portfolio/data/portfolioData';

export { SECTION_SEO, PROJECT_CATEGORY_SEO } from '@portfolio/utils/seo';
export { THEME_COLORS, RADII, SHADOWS, FONTS, SPACING } from '@portfolio/lib/tokens';