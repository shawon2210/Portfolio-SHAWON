import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Eye,
  Check,
  Copy,
  Activity,
  Maximize2,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  THEME_COLORS,
  SYNTAX_PALETTE,
  RADII,
  SHADOWS,
} from '../lib/tokens';
import {
  MOTION_EASING,
  MOTION_DURATIONS,
  MOTION_STAGGER,
} from '../lib/motion';
import {
  Section,
  Reveal,
  SplitText,
  GlassCard,
  MagneticButton,
  Marquee,
  NumberTicker,
  Badge,
  Tag,
} from '../components/primitives';

export const DevUiShowcase: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const techChips = [
    'TypeScript 5.8',
    'React 19',
    'Next.js 15',
    'Tailwind v4',
    'Motion v12',
    'Three.js raw',
    'Node.js 22',
    'FastAPI',
    'PostgreSQL',
    'Docker',
  ];

  return (
    <div
      className={`min-h-screen bg-[#090b11] text-slate-300 pb-24 selection:bg-sky-500/20 selection:text-sky-300 ${
        simulateReducedMotion ? 'reduced-motion-simulated' : ''
      }`}
    >
      {/* Dev Header */}
      <header className="sticky top-0 z-70 bg-[#090b11]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="accent" icon={<Terminal size={12} />}>
              DEV-ONLY
            </Badge>
            <h1 className="text-sm md:text-base font-semibold text-white tracking-tight">
              Design System & Primitives Showcase
            </h1>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
              Phase 1 / Gate 1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulateReducedMotion(!simulateReducedMotion)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                simulateReducedMotion
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white'
              }`}
            >
              Reduced Motion: {simulateReducedMotion ? 'ON' : 'OFF'}
            </button>
            <a
              href="#home"
              className="text-xs px-3 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
            >
              Back to Site
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 pt-8">
        {/* Intro */}
        <Section className="py-6 border-b border-white/[0.06]">
          <Reveal>
            <div className="space-y-4 max-w-3xl">
              <Badge variant="availability" pulse>
                Design System Foundation Active
              </Badge>
              <SplitText
                text="Editorial Precision & Kinetic Architecture"
                className="text-3xl md:text-5xl font-bold text-white tracking-tight"
              />
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Strict token specifications under Tailwind v4 @theme, custom 3D syntax palette,
                60fps spring primitives, and accessible glass surfaces. Tested for WCAG AA
                compliance and reduced-motion fallbacks.
              </p>
            </div>
          </Reveal>
        </Section>

        {/* Section 1: Color Tokens */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Palette className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              1. Color Tokens (Tailwind v4 @theme)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(THEME_COLORS).map(([key, val]) => (
              <GlassCard
                key={key}
                interactive={false}
                className="p-4 space-y-3 bg-[#0d1017]/50"
              >
                <div
                  className="h-16 w-full rounded-md border border-white/10 flex items-center justify-center font-mono text-[10px] text-white/70"
                  style={{
                    backgroundColor: val.startsWith('rgba') ? val : val,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {val.startsWith('rgba') && (
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">
                      Translucent
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="font-mono text-slate-500 text-[11px]">{val}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(val, key)}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy color"
                  >
                    {copiedKey === key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 2: 3D Scene Syntax Palette */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Layers className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              2. 3D Floating Code Syntax Palette
            </h2>
            <span className="text-xs font-mono text-slate-500">
              (For Phase 3 WebGL Offscreen Canvas Atlas)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(SYNTAX_PALETTE).map(([token, hex]) => (
              <GlassCard
                key={token}
                interactive={false}
                className="p-3 text-center space-y-2 bg-[#0c0f16]/60"
              >
                <div
                  className="h-10 w-full rounded flex items-center justify-center font-mono text-xs font-bold shadow-inner"
                  style={{ backgroundColor: `${hex}22`, color: hex, border: `1px solid ${hex}44` }}
                >
                  {hex}
                </div>
                <div className="font-mono text-[11px] text-slate-400 capitalize">
                  {token}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 3: Motion Tokens */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              3. Motion Tokens & Easing Curves
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 space-y-2">
              <div className="text-xs font-mono text-slate-400">SIGNATURE EASING</div>
              <div className="text-sm font-semibold text-white">
                cubic-bezier(0.22, 1, 0.36, 1)
              </div>
              <div className="font-mono text-xs text-slate-500">
                [{MOTION_EASING.join(', ')}]
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Restrained, editorial exponential decel. Zero bounce on content surfaces.
              </p>
            </GlassCard>

            <GlassCard className="p-4 space-y-2">
              <div className="text-xs font-mono text-slate-400">DURATION SCALE</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div>instant: {MOTION_DURATIONS.instant}s (150ms)</div>
                <div>fast: {MOTION_DURATIONS.fast}s (300ms)</div>
                <div>base: {MOTION_DURATIONS.base}s (600ms)</div>
                <div>slow: {MOTION_DURATIONS.slow}s (900ms)</div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 space-y-2">
              <div className="text-xs font-mono text-slate-400">STAGGER DELAY</div>
              <div className="text-sm font-semibold text-white">
                {MOTION_STAGGER * 1000} ms
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Unified stagger cadence across lists, navigation pill items, and tags.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Section 4: Interactive Primitives Showcase */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              4. Interactive Primitives Showcase
            </h2>
          </div>

          {/* Primitives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GlassCard with Spotlight */}
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="accent">GlassCard</Badge>
                <span className="text-xs font-mono text-slate-500">
                  Cursor-spotlight border
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Dynamic Cursor Radial Spotlight
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Hover or move cursor across this card. An ethereal 600px radial light source tracks
                the cursor coordinates smoothly, illuminating the 1px border without layout shifts.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Tag variant="accent">Interactive</Tag>
                <Tag variant="glass">Zero Layout Shift</Tag>
                <Tag variant="subtle">Tailwind v4 Glass</Tag>
              </div>
            </GlassCard>

            {/* Magnetic Button */}
            <GlassCard interactive={false} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="neutral">MagneticButton</Badge>
                <span className="text-xs font-mono text-slate-500">Spring Damping 15</span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Spring-Driven Magnetic Attraction
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Smooth cursor pull disabled on touch devices and reduced-motion preferences.
              </p>
              <div className="pt-3 flex items-center gap-4">
                <MagneticButton className="px-5 py-2.5 rounded-lg bg-sky-500 text-slate-950 font-medium text-xs shadow-lg shadow-sky-500/20 hover:bg-sky-400">
                  Primary Action
                </MagneticButton>
                <MagneticButton className="px-5 py-2.5 rounded-lg bg-white/[0.05] text-slate-200 font-medium text-xs border border-white/[0.1] hover:bg-white/[0.1]">
                  Secondary Action
                </MagneticButton>
              </div>
            </GlassCard>

            {/* SplitText Reveal */}
            <GlassCard interactive={false} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="neutral">SplitText & Reveal</Badge>
                <span className="text-xs font-mono text-slate-500">Blur-Fade Motion</span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Editorial Character & Word Sequencing
              </h3>
              <div className="p-4 rounded-lg bg-slate-950/60 border border-white/[0.06] space-y-2">
                <SplitText
                  text="Shawon Molla — Full-Stack Engineer, Product Systems & AI"
                  className="text-base font-semibold text-sky-400"
                  stagger={0.03}
                />
                <Reveal delay={0.2}>
                  <p className="text-xs text-slate-400">
                    Revealed with cubic-bezier(0.22, 1, 0.36, 1) and subtle initial blur.
                  </p>
                </Reveal>
              </div>
            </GlassCard>

            {/* Number Ticker */}
            <GlassCard interactive={false} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="availability" pulse>
                  NumberTicker
                </Badge>
                <span className="text-xs font-mono text-slate-500">In-View Spring</span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Metric Springs with Formatter
              </h3>
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    <NumberTicker value={99.9} decimalPlaces={1} />%
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">Uptime SLA</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-2xl font-bold font-mono text-sky-400">
                    <NumberTicker value={100} />%
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">Delivery</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-2xl font-bold font-mono text-violet-400">
                    <NumberTicker value={4} />+
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">Years Exp</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Badges & Tags Matrix */}
          <GlassCard interactive={false} className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Badge & Tag Variant Matrix
            </h3>
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-24">Badges:</span>
                <Badge variant="availability" pulse>
                  AVAILABLE FOR HIRE
                </Badge>
                <Badge variant="accent">PRODUCTION READY</Badge>
                <Badge variant="neutral">FULL STACK</Badge>
                <Badge variant="outline">OPEN SOURCE</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-24">Tags:</span>
                <Tag variant="glass" size="md">
                  Next.js 15
                </Tag>
                <Tag variant="accent" size="md">
                  TypeScript 5.8
                </Tag>
                <Tag variant="subtle" size="md">
                  PostgreSQL
                </Tag>
                <Tag variant="glass" size="sm" interactive>
                  Clickable Tag
                </Tag>
              </div>
            </div>
          </GlassCard>

          {/* Infinite Marquee */}
          <GlassCard interactive={false} className="p-6 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Infinite Looping Marquee
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Pauses on Hover / Focus
              </span>
            </div>
            <div className="py-2">
              <Marquee speed={32} pauseOnHover>
                {techChips.map((chip, idx) => (
                  <Tag
                    key={idx}
                    variant={idx % 2 === 0 ? 'accent' : 'glass'}
                    size="md"
                    className="font-mono"
                  >
                    {chip}
                  </Tag>
                ))}
              </Marquee>
            </div>
          </GlassCard>
        </section>

        {/* Section 5: Radii & Shadow Tokens */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Zap className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              5. Spatial Tokens: Radii & Depth Shadows
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(RADII).map(([key, val]) => (
              <div
                key={key}
                className="p-4 bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
                style={{ borderRadius: val }}
              >
                <div className="text-xs font-mono text-slate-400 capitalize">{key}</div>
                <div className="text-xs font-mono text-sky-400 mt-4">{String(val)}</div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
};
