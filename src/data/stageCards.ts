import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from './portfolioData';

/**
 * MOBILE-FIRST v5 — PHASE 2: content for the portrait-stage floating cards.
 *
 * HARD RULE: nothing here is invented. Every value is derived from
 * portfolioData, and the stack chips are filtered against SKILL_CATEGORIES at
 * module load so a chip can never render a skill the portfolio does not list.
 *
 * The stat is intentionally labelled neutrally ("in portfolio"): PROJECTS mixes
 * app builds with education/cert records, so we do NOT claim "shipped".
 */

// Real stat: the exact number of project entries in portfolioData.
export const STAGE_STAT = {
  label: 'Projects',
  value: String(PROJECTS.length),
  valueNum: PROJECTS.length,
  caption: 'in portfolio',
} as const;

// Curated-but-real representative stack. Each is verified present in
// SKILL_CATEGORIES below; anything absent is filtered out rather than invented.
const WANTED_STACK = [
  'TypeScript',
  'React.js',
  'NestJS',
  'PostgreSQL',
  'Next.js 15',
  'Tailwind CSS',
] as const;

const LISTED_SKILLS = new Set<string>(
  SKILL_CATEGORIES.flatMap((c) => c.skills as string[]),
);

export const STAGE_STACK = {
  label: 'Core Stack',
  chips: WANTED_STACK.filter((s) => LISTED_SKILLS.has(s)),
} as const;

// Real availability text straight from portfolioData (same source as the hero
// availability badge). Green dot reflects the --color-availability token.
export const STAGE_STATUS = {
  text: PERSONAL_INFO.statusPill,
} as const;