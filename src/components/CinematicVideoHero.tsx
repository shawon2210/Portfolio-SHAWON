import React from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowRight, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TabType } from '../types';
import './CinematicVideoHero.css';

interface CinematicVideoHeroProps {
  onNavigate: (tab: TabType) => void;
  onOpenResume: () => void;
  onScrollDown: () => void;
}

export const CinematicVideoHero: React.FC<CinematicVideoHeroProps> = ({
  onNavigate,
  onOpenResume,
  onScrollDown,
}) => {
  const customEase = [0.16, 1, 0.3, 1] as const;
  const videoUrl =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4';

  return (
    <section className="cinematic-hero-root">
      {/* Absolute Full-Screen Background Video */}
      <motion.div
        className="cinematic-video-wrapper"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: customEase }}
      >
        <video
          className="cinematic-video-element"
          autoPlay
          muted
          loop
          playsInline
          src={videoUrl}
        />
      </motion.div>

      {/* Top subtle scrim */}
      <div className="cinematic-top-scrim" />

      {/* Middle Top Status Pill */}
      <div className="cinematic-hero-center">
        <motion.div
          className="cinematic-pill-chip"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: customEase }}
        >
          <span className="cinematic-status-dot" />
          <span>Systems Architect &bull; AI Full-Stack</span>
        </motion.div>
      </div>

      {/* Footer Content Pinned to Bottom with Fade-Up Gradient */}
      <motion.div
        className="cinematic-hero-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: customEase }}
      >
        <div className="cinematic-hero-content">
          {/* Subtitle */}
          <motion.p
            className="cinematic-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: customEase }}
          >
            {PERSONAL_INFO.name} &bull; SOFTWARE ENGINEER
          </motion.p>

          {/* Heading */}
          <motion.h1
            className="cinematic-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: customEase }}
          >
            Engineering High-Scale Systems &amp; Autonomous AI
          </motion.h1>

          {/* Bio text */}
          <motion.p
            className="cinematic-bio"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: customEase }}
          >
            High-concurrency full-stack platforms, multi-tenant LangChain RAG pipelines, and distributed databases built with mathematical precision.
          </motion.p>

          {/* Action Buttons Row */}
          <motion.div
            className="cinematic-buttons-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: customEase }}
          >
            <button
              onClick={() => onNavigate('projects')}
              className="cinematic-btn-primary"
            >
              <span>Explore Projects</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenResume}
              className="cinematic-btn-secondary"
            >
              <FileText size={16} />
              <span>Inspect CV</span>
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="cinematic-btn-icon-plus"
              title="Collaborate & Initiate Discussion"
              aria-label="Collaborate with Shawon"
            >
              <Plus size={20} />
            </button>
          </motion.div>

          {/* Scroll Down Cue */}
          <motion.div
            className="cinematic-scroll-cue"
            onClick={onScrollDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <span>Scroll For System Blueprint</span>
            <span className="material-symbols-outlined text-[16px] animate-bounce">
              keyboard_arrow_down
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
