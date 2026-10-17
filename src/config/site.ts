/**
 * Single source of truth for the deployment origin.
 *
 * Every canonical URL, `og:url`, JSON-LD `@id`, sitemap entry and
 * `robots.txt` `Sitemap:` directive derives from this value. The static
 * files in `index.html` and `public/` use the `%SITE_ORIGIN%` token, which the
 * `site-origin` Vite plugin substitutes from `SITE_ORIGIN` at build time.
 *
 * To change the domain, change `SITE_ORIGIN` below, or set the `SITE_ORIGIN`
 * environment variable for the build. Do not hardcode the origin anywhere else.
 */
export const SITE_ORIGIN = 'https://shawon-portfolio-green.vercel.app';

/** Origin with any trailing slash removed, safe for path concatenation. */
export const siteOrigin = SITE_ORIGIN.replace(/\/+$/, '');

/** Absolute URL for a site-relative path, e.g. `/sitemap.xml`. */
export const absoluteUrl = (path = '/'): string =>
  `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Fallback origin for non-browser (SSR / prerender) contexts, where
 * `window.location.origin` is unavailable.
 */
export const originForEnvironment = (): string =>
  typeof window === 'undefined' ? siteOrigin : window.location.origin;