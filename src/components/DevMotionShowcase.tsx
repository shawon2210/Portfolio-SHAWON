import React from 'react';
import {
  FadeIn,
  GradientHeading,
  AnimatedText,
  Magnet,
  TiltCard,
  ScrollMarquee,
  ParallaxLayer,
  MaskReveal,
  StickyStack,
  StickyStackItem,
  PillButton,
  GhostButton,
  Anchor3D,
} from './motion';
import { CursorFollower } from './motion/CursorFollower';
import { Sparkles, ArrowRight, Code2, Rocket, ExternalLink } from 'lucide-react';

export const DevMotionShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-[#e2e8f0] px-4 sm:px-8 py-16 max-w-6xl mx-auto space-y-24">
      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PHASE 1 MOTION ENGINE HARNESS</span>
        </div>
        <GradientHeading text="Cinematic Motion Primitives" as="h1" className="text-4xl sm:text-6xl" />
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-mono">
          Full verification suite for Motion v12 primitives conforming to portfolio v3 patterns.
        </p>
      </div>

      {/* 1. GradientHeading */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">1. GradientHeading (vw-fluid &amp; mask rise)</h3>
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <GradientHeading text="MD SHAWON MOLLA" as="h2" className="text-3xl sm:text-7xl" />
          <GradientHeading
            text="FULL-STACK &amp; AI SYSTEMS"
            as="h3"
            gradient="linear-gradient(180deg, #38bdf8 0%, #34d399 100%)"
            className="text-xl sm:text-4xl"
          />
        </div>
      </section>

      {/* 2. FadeIn */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">2. FadeIn (staggered &amp; blur entrance)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 0.15, 0.3].map((delay, idx) => (
            <FadeIn key={idx} delay={delay} className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs font-mono text-sky-400">Card 0{idx + 1}</span>
              <p className="text-sm mt-2 text-slate-300">Staggered blur-fade reveal with delay {delay}s</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 3. AnimatedText */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">3. AnimatedText (character-by-character scroll opacity)</h3>
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <AnimatedText
            text="Ambition-driven Computer Science graduate specializing in modern web development, high-concurrency microservices, and autonomous AI systems."
            className="text-xl sm:text-3xl font-light leading-relaxed text-slate-200"
          />
          <p className="text-xs font-mono text-slate-500">↑ Scroll up and down to observe character opacity transitions (0.2 → 1.0)</p>
        </div>
      </section>

      {/* 4. Magnet & PillButton / GhostButton */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">4. Magnet &amp; PillButton / GhostButton</h3>
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center gap-6">
          <PillButton>
            <span>Explore Projects</span>
            <Rocket className="w-4 h-4" />
          </PillButton>

          <GhostButton>
            <span>Inspect CV Resume</span>
            <ExternalLink className="w-4 h-4" />
          </GhostButton>

          <Magnet strength={0.4} padding={30}>
            <div className="px-5 py-3 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-mono cursor-pointer">
              Magnetic Custom Box
            </div>
          </Magnet>
        </div>
      </section>

      {/* 5. TiltCard */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">5. TiltCard (3D spring tilt + specular highlight)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
            <Code2 className="w-8 h-8 text-sky-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">High-Performance Core</h4>
            <p className="text-sm text-slate-400">
              Move cursor over card to test dynamic 3D perspective rotation and real-time radial specular light reflection.
            </p>
          </TiltCard>

          <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
            <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Autonomous AI Nodes</h4>
            <p className="text-sm text-slate-400">
              Smooth spring response with touch-device fallback and zero layout thrashing.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* 6. ScrollMarquee */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">6. ScrollMarquee (scroll-driven + velocity skew)</h3>
        <div className="space-y-4">
          <ScrollMarquee direction="left">
            {['AmarShop E-Commerce', 'B2B Enterprise ERP', 'AI Vector Search', 'Distributed Microservices', 'Next.js 15'].map(
              (item, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 text-xs sm:text-sm font-mono text-slate-300"
                >
                  {item}
                </span>
              )
            )}
          </ScrollMarquee>

          <ScrollMarquee direction="right">
            {['FastAPI Python', 'PostgreSQL CTEs', 'Docker Swarm', 'Redis Cache Cluster', 'Tailwind CSS v4'].map(
              (item, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs sm:text-sm font-mono text-sky-300"
                >
                  {item}
                </span>
              )
            )}
          </ScrollMarquee>
        </div>
      </section>

      {/* 7. ParallaxLayer & MaskReveal */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">7. ParallaxLayer &amp; MaskReveal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ParallaxLayer speed={0.15} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="text-xs font-mono text-sky-400">Parallax Layer (Speed 0.15)</span>
            <p className="text-sm text-slate-300 mt-2">Drives smooth Y-axis translation tied to section scroll.</p>
          </ParallaxLayer>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <span className="text-xs font-mono text-emerald-400">MaskReveal (Clip-Path Wipe)</span>
            <MaskReveal direction="up">
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border border-white/10 text-white font-mono text-sm">
                Revealed with clean clip-path wipe animation
              </div>
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* 8. StickyStack */}
      <section className="space-y-4 pb-20">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">8. StickyStack (reference targetScale formula)</h3>
        <StickyStack>
          {[0, 1, 2].map((idx) => (
            <StickyStackItem key={idx} index={idx} total={3}>
              <div className="w-full max-w-4xl p-8 rounded-[40px] bg-[#111420] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono text-sky-400">Sticky Card 0{idx + 1}</span>
                  <h4 className="text-2xl font-bold text-white mt-1">Stacking Stage {idx + 1}</h4>
                  <p className="text-sm text-slate-400 mt-2 max-w-md">
                    Scales down as subsequent cards scroll over it according to targetScale = 1 - (total - 1 - index) * 0.03.
                  </p>
                </div>
                <div className="w-32 h-32 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 font-mono text-2xl font-bold">
                  0{idx + 1}
                </div>
              </div>
            </StickyStackItem>
          ))}
        </StickyStack>
      </section>

      {/* 9. Anchored 3D Objects in Shared WebGL Scene */}
      <section className="space-y-4 pb-24">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-mono">9. Anchored 3D Objects (Single Unified Canvas)</h3>
        <p className="text-sm text-slate-400 font-mono">
          DOM elements with <code className="text-sky-400">&lt;Anchor3D name="..."&gt;</code> dynamically project their screen positions to 3D meshes in the single fixed WebGL canvas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <Anchor3D name="about-torus" className="h-44 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-end p-4">
            <span className="text-xs font-mono text-sky-400">Anchor: about-torus</span>
            <span className="text-[11px] text-slate-400">Torus Knot Wireframe</span>
          </Anchor3D>

          <Anchor3D name="about-gyro" className="h-44 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-end p-4">
            <span className="text-xs font-mono text-violet-400">Anchor: about-gyro</span>
            <span className="text-[11px] text-slate-400">Gyroscope Rings</span>
          </Anchor3D>

          <Anchor3D name="about-blocks" className="h-44 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-end p-4">
            <span className="text-xs font-mono text-emerald-400">Anchor: about-blocks</span>
            <span className="text-[11px] text-slate-400">Instanced Cube Matrix</span>
          </Anchor3D>

          <Anchor3D name="about-noise-sphere" className="h-44 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-end p-4">
            <span className="text-xs font-mono text-amber-400">Anchor: about-noise-sphere</span>
            <span className="text-[11px] text-slate-400">Pulsing Sphere Core</span>
          </Anchor3D>
        </div>

        <div className="pt-6 flex justify-center">
          <Anchor3D name="contact-globe" className="w-full max-w-md h-52 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-end p-6 text-center">
            <span className="text-xs font-mono text-sky-400">Anchor: contact-globe</span>
            <span className="text-xs text-slate-400">Point-Cloud Interactive Coordinate Globe</span>
          </Anchor3D>
        </div>
      </section>

      {/* Global Cursor Follower included in showcase */}
      <CursorFollower />
    </div>
  );
};
