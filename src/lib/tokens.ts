/**
 * Shared Design Tokens & Code-Syntax Palette
 * Single source of truth for UI and 3D Canvas scenes
 */

export const THEME_COLORS = {
  canvas: '#090b11',
  surfaceGlass: 'rgba(255, 255, 255, 0.03)',
  surfaceGlassHover: 'rgba(255, 255, 255, 0.06)',
  borderGlass: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(56, 189, 248, 0.35)',
  accent: '#38bdf8', // Sky 400
  availability: '#34d399', // Emerald 400 (strict status only)
  heading: '#e2e8f0', // Slate 200
  body: '#94a3b8', // Slate 400
} as const;

/**
 * Code-Syntax Palette for the 3D Floating Code Scene
 * Derived directly from the core design tokens.
 */
export const SYNTAX_PALETTE = {
  sky: '#38bdf8', // Keywords, identifiers (const, function, return)
  emerald: '#34d399', // Strings, template literals ("system", `ok`)
  violet: '#a78bfa', // Types, interfaces, classes (Promise, Record)
  amber: '#fbbf24', // Numbers, booleans, parameters (42, true)
  slate: '#64748b', // Comments (// architecture, JSDoc)
  dim: '#334155', // Punctuation ({, }, =>, ;)
  cardBg: 'rgba(9, 11, 17, 0.88)', // Deep obsidian frosted card
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorderHighlight: 'rgba(56, 189, 248, 0.3)',
} as const;

export type SyntaxColorKey = keyof typeof SYNTAX_PALETTE;

export const RADII = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const SHADOWS = {
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  glowSky: '0 0 24px -4px rgba(56, 189, 248, 0.35)',
  glowEmerald: '0 0 24px -4px rgba(52, 211, 153, 0.35)',
} as const;

export const FONTS = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const SPACING = {
  sectionY: 'clamp(3.5rem, 8vw, 6.5rem)',
  containerMax: '72rem',
} as const;
