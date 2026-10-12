import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GlassCard, Badge, Section } from '../components/primitives';
import { MOTION_EASING, MOTION_DURATIONS, MOTION_STAGGER } from '../lib/motion';
import { GradientHeading, Anchor3D, Magnet, PillButton } from '../components/motion';

interface ContactViewProps {
  avatarUrl?: string; // kept for App.tsx compat; not rendered here
  onOpenResume: () => void;
  onOpenUploadModal?: () => void; // kept for App.tsx compat
  onShowToast: (msg: string) => void;
}

/* ─── motion variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATIONS.base, ease: MOTION_EASING },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: MOTION_STAGGER * 2 } },
};

/* ─── copy-trigger hook ─── */
function useCopy(label: string, onShowToast: (m: string) => void) {
  const [copied, setCopied] = useState(false);
  const trigger = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    onShowToast(`${label} copied!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, trigger };
}

export const ContactView: React.FC<ContactViewProps> = ({
  onOpenResume,
  onShowToast,
}) => {
  /* ── copy triggers ── */
  const emailCopy = useCopy('Email', onShowToast);
  const phoneCopy = useCopy('Phone', onShowToast);

  /* ── form state ── */
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Full-Time SWE Role (Frontend/Full-Stack)',
    message: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* ── validation & submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please enter a message.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onShowToast('Please fill in all required fields.');
      return;
    }
    if (honeypot) {
      setSubmitSuccess(true);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      onShowToast(`Thank you, ${formData.name}! Message queued.`);
      const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
        `${formData.subject} from ${formData.name}`
      )}&body=${encodeURIComponent(
        `From: ${formData.name} <${formData.email}>\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
      )}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
        setFormData({
          name: '',
          email: '',
          subject: 'Full-Time SWE Role (Frontend/Full-Stack)',
          message: '',
        });
        setSubmitSuccess(false);
      }, 1200);
    }, 700);
  };

  return (
    <Section className="pb-24">
      {/* ── Section header with Giant Gradient Heading & 3D Contact Globe ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-14 text-center flex flex-col items-center relative"
      >
        <Badge variant="accent" className="mb-4">
          <MessageSquare className="w-3 h-3" />
          <span>Contact &bull; Direct Connection</span>
        </Badge>

        <GradientHeading
          text="LET'S BUILD SOMETHING RESILIENT"
          as="h2"
          className="text-3xl sm:text-5xl lg:text-6xl text-center justify-center font-black mb-6 max-w-4xl"
        />

        {/* 3D Contact Globe Anchor Stage */}
        <div className="relative my-4 flex items-center justify-center">
          <Magnet padding={30} strength={0.25}>
            <div className="relative p-6 flex flex-col items-center justify-center">
              {/* PHASE 5: drag affordance in the contextual cursor */}
              <Anchor3D
                name="contact-globe"
                className="w-48 h-48 sm:w-60 sm:h-60 rounded-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
                dataCursor="drag"
              >
                <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-xl pointer-events-none" />
              </Anchor3D>
              <span className="font-mono text-[11px] text-slate-400 mt-2 tracking-widest uppercase">
                Dhaka &bull; Remote Worldwide &bull; Coordinate Active
              </span>
            </div>
          </Magnet>
        </div>

        <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Open to full-time software engineering roles, distributed platform architecture, and high-impact teams. Reach out via email, phone, or direct dispatch.
        </p>
      </motion.div>

      {/* ── Two-column layout on ≥ lg ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

        {/* Left col — channels (2 columns on lg) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          {/* ── Email card ── */}
          <motion.div variants={fadeUp}>
            <GlassCard interactive className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-sky-400" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8] mb-0.5">
                  Primary Email
                </span>
                <span className="text-sm font-semibold text-[#e2e8f0] truncate select-all font-mono">
                  {PERSONAL_INFO.email}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => emailCopy.trigger(PERSONAL_INFO.email)}
                  aria-label="Copy email address"
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-sky-400/35 hover:bg-sky-400/5 flex items-center justify-center text-[#94a3b8] hover:text-sky-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {emailCopy.copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Send <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Phone / WhatsApp card ── */}
          <motion.div variants={fadeUp}>
            <GlassCard interactive className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8] mb-0.5">
                  Call / WhatsApp
                </span>
                <span className="text-sm font-semibold text-[#e2e8f0] truncate font-mono">
                  {PERSONAL_INFO.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => phoneCopy.trigger(PERSONAL_INFO.phone)}
                  aria-label="Copy phone number"
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-emerald-400/35 hover:bg-emerald-400/5 flex items-center justify-center text-[#94a3b8] hover:text-emerald-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {phoneCopy.copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <a
                  href={PERSONAL_INFO.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Chat <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Location card ── */}
          <motion.div variants={fadeUp}>
            <GlassCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8] mb-0.5">
                  Base Location
                </span>
                <span className="text-sm font-semibold text-[#e2e8f0] truncate">
                  {PERSONAL_INFO.location}
                </span>
                <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Remote / On-site · Worldwide
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Verified channels ── */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8] px-1">
              Verified Channels
            </span>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <GlassCard interactive className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-4.5 h-4.5 text-sky-400" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#e2e8f0] group-hover:text-sky-400 transition-colors">
                      LinkedIn
                    </span>
                    <span className="font-mono text-[11px] text-[#94a3b8] truncate">
                      Connect &amp; message directly
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#94a3b8] group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </GlassCard>
            </a>

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <GlassCard interactive className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Github className="w-4.5 h-4.5 text-[#e2e8f0]" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#e2e8f0] group-hover:text-[#38bdf8] transition-colors">
                      GitHub
                    </span>
                    <span className="font-mono text-[11px] text-[#94a3b8] truncate">
                      Repos, commits &amp; open source
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </GlassCard>
            </a>

            {/* Live App */}
            <a
              href={PERSONAL_INFO.liveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <GlassCard interactive className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4.5 h-4.5 text-amber-400" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#e2e8f0] group-hover:text-amber-400 transition-colors">
                      Odd Boundary
                    </span>
                    <span className="font-mono text-[11px] text-[#94a3b8] truncate">
                      oddboundary.lovable.app
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#94a3b8] group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </GlassCard>
            </a>
          </motion.div>

          {/* ── Resume quick-access ── */}
          <motion.div variants={fadeUp}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-sky-400" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#e2e8f0]">Curriculum Vitae</p>
                  <p className="font-mono text-[11px] text-[#94a3b8]">Full technical profile · PDF</p>
                </div>
              </div>
              <button
                onClick={onOpenResume}
                className="w-full py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-sky-400/35 hover:bg-sky-400/5 text-sky-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <FileText className="w-4 h-4" />
                View / Download Resume
              </button>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Right col — contact form (3 of 5 columns on lg) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-sky-400" />
              <h3 className="text-base font-bold text-[#e2e8f0] tracking-[-0.02em]">
                Send a Message
              </h3>
            </div>
            <p className="text-[#94a3b8] text-sm mb-5 leading-[1.65]">
              Drop a proposal, recruitment request, or collaboration inquiry —
              I'll respond within 24 hours.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="font-mono text-[11px] uppercase tracking-widest text-[#94a3b8] flex items-center justify-between"
                  >
                    Your Name
                    <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    data-testid="form-contact-name"
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'cn-err' : undefined}
                    className={`w-full bg-white/[0.03] text-[#e2e8f0] text-sm px-3.5 py-2.5 rounded-lg border transition-all outline-none focus:ring-2 placeholder:text-[#94a3b8]/40 ${
                      errors.name
                        ? 'border-red-500/60 focus:ring-red-500/30'
                        : 'border-white/[0.08] focus:border-sky-400/40 focus:ring-sky-400/20'
                    }`}
                  />
                  {errors.name && (
                    <span id="cn-err" role="alert" className="font-mono text-[11px] text-red-400">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="font-mono text-[11px] uppercase tracking-widest text-[#94a3b8] flex items-center justify-between"
                  >
                    Email Address
                    <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    data-testid="form-contact-email"
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'ce-err' : undefined}
                    className={`w-full bg-white/[0.03] text-[#e2e8f0] text-sm px-3.5 py-2.5 rounded-lg border transition-all outline-none focus:ring-2 placeholder:text-[#94a3b8]/40 ${
                      errors.email
                        ? 'border-red-500/60 focus:ring-red-500/30'
                        : 'border-white/[0.08] focus:border-sky-400/40 focus:ring-sky-400/20'
                    }`}
                  />
                  {errors.email && (
                    <span id="ce-err" role="alert" className="font-mono text-[11px] text-red-400">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-subject"
                  className="font-mono text-[11px] uppercase tracking-widest text-[#94a3b8]"
                >
                  Subject / Inquiry Type
                </label>
                <select
                  data-testid="form-contact-subject"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/[0.03] text-[#e2e8f0] text-sm px-3.5 py-2.5 rounded-lg border border-white/[0.08] outline-none focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 appearance-none transition-all"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="Full-Time SWE Role (Frontend/Full-Stack)">
                    Full-Time SWE Role (Frontend / Full-Stack)
                  </option>
                  <option value="Contract / Milestone Project">
                    Contract / Milestone Project
                  </option>
                  <option value="Technical Collaboration / Open Source">
                    Technical Collaboration / Open Source
                  </option>
                  <option value="General Coffee Chat">General Coffee Chat</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="font-mono text-[11px] uppercase tracking-widest text-[#94a3b8] flex items-center justify-between"
                >
                  Message
                  <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <textarea
                  data-testid="form-contact-message"
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Describe your stack, role type, or what you'd like to build together..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                  }}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'cm-err' : undefined}
                  className={`w-full bg-white/[0.03] text-[#e2e8f0] text-sm px-3.5 py-2.5 rounded-lg border transition-all outline-none focus:ring-2 resize-none placeholder:text-[#94a3b8]/40 ${
                    errors.message
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-white/[0.08] focus:border-sky-400/40 focus:ring-sky-400/20'
                  }`}
                />
                {errors.message && (
                  <span id="cm-err" role="alert" className="font-mono text-[11px] text-red-400">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`relative overflow-hidden mt-1 w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-60 disabled:cursor-not-allowed ${
                  submitSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-500 hover:bg-sky-400 text-white'
                }`}
              >
                {/* shimmer sweep */}
                {!submitSuccess && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 animate-shimmer"
                  />
                )}
                <AnimatePresence mode="wait" initial={false}>
                  {submitSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Message Queued!
                    </motion.span>
                  ) : isSubmitting ? (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      Dispatching…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#94a3b8]"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest">
            {PERSONAL_INFO.availabilityDetails}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Print access (footer only) */}
          <button
            onClick={() => window.print()}
            className="font-mono text-[11px] text-[#94a3b8] hover:text-[#e2e8f0] transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
          >
            Print Portfolio
          </button>

          <span className="font-mono text-[11px]">
            © {new Date().getFullYear()} {PERSONAL_INFO.shortName}
          </span>
        </div>
      </motion.footer>
    </Section>
  );
};
