import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';

interface ContactViewProps {
  avatarUrl: string;
  onOpenResume: () => void;
  onOpenUploadModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  avatarUrl,
  onOpenResume,
  onOpenUploadModal,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Full-Time SWE Role (Frontend/Full-Stack)',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      onShowToast(`Thank you, ${formData.name}! Message queued.`);

      // Launch mailto fallback
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
      }, 1000);
    }, 700);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-4xl mx-auto">
      {/* Decorative Atmospheric Ambient Light */}
      <div className="relative w-full overflow-hidden px-4 sm:px-6 pt-4">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-28 right-0 w-44 h-44 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Availability Status Pill */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex items-center justify-center mb-4"
        >
          <div className="inline-flex items-center gap-1.5 bg-surface-container-high/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/5 text-center">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="font-status-label text-[10px] sm:text-[11px] text-secondary uppercase tracking-wider font-semibold">
              {PERSONAL_INFO.availabilityDetails}
            </span>
          </div>
        </motion.div>

        {/* Header Block with Executive Mini-Card */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center flex flex-col items-center mb-6"
        >
          <div
            onClick={onOpenUploadModal}
            className="relative mb-3 cursor-pointer group"
            title="Click to change photo"
          >
            <img
              src={avatarUrl}
              alt={PERSONAL_INFO.name}
              className="w-16 h-16 rounded-full object-cover object-top ring-2 ring-primary/40 shadow-xl group-hover:ring-primary transition-all"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary rounded-full ring-2 ring-surface"></span>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-primary">
              <AppIcon name="photo_camera" className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 mb-1.5 text-primary">
            <AppIcon name="cell_tower" className="w-[18px] h-[18px]" />
            <span className="font-code-sm text-xs tracking-wide">PORTFOLIO_COMMS // V2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1.5">
            Get In Touch
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
            Open to Junior Software Engineer, Full-Stack, and Frontend roles. Let's build something remarkable.
          </p>
        </motion.div>

        {/* Direct Contact Cards (Vertical Bento Stack) */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 flex flex-col gap-2.5 mb-6"
        >
          {/* Email Card */}
          <div className="bg-surface-container-high rounded-xl p-4 shadow-md flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-primary border border-white/5">
                <AppIcon name="alternate_email" className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-code-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Primary Email
                </span>
                <span className="font-code-md text-xs sm:text-sm text-on-surface font-semibold truncate select-all">
                  {PERSONAL_INFO.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-white/5 cursor-pointer"
                onClick={() => handleCopy(PERSONAL_INFO.email, 'Email')}
                title="Copy Email"
              >
                <AppIcon name="content_copy" className="w-[18px] h-[18px]" />
              </button>
              <a
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-code-sm text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                href={`mailto:${PERSONAL_INFO.email}`}
              >
                <span>Send</span>
                <AppIcon name="arrow_outward" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="bg-surface-container-high rounded-xl p-4 shadow-md flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary border border-white/5">
                <AppIcon name="phone_iphone" className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-code-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Call / WhatsApp
                </span>
                <span className="font-code-md text-xs sm:text-sm text-on-surface font-semibold truncate">
                  {PERSONAL_INFO.phone}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors border border-white/5 cursor-pointer"
                onClick={() => handleCopy(PERSONAL_INFO.phone, 'Phone number')}
                title="Copy Number"
              >
                <AppIcon name="content_copy" className="w-[18px] h-[18px]" />
              </button>
              <a
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-code-sm text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                href={PERSONAL_INFO.whatsAppUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Chat</span>
                <AppIcon name="chat" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location & Telemetry Card */}
          <div className="bg-surface-container-high rounded-xl p-4 shadow-md flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-tertiary border border-white/5">
                <AppIcon name="pin_drop" className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-code-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Base Location
                </span>
                <span className="font-body-md text-xs sm:text-sm text-on-surface font-semibold truncate">
                  {PERSONAL_INFO.location}
                </span>
                <span className="font-code-sm text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                  <span>Open worldwide (Remote / On-site)</span>
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0 border border-white/5">
              <AppIcon name="public" className="w-[18px] h-[18px]" />
            </div>
          </div>
        </motion.div>

        {/* Quick Message Form Section */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 bg-surface-container rounded-xl p-4 sm:p-5 shadow-lg mb-6 border border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AppIcon name="send_time_extension" className="w-5 h-5 text-primary" />
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold tracking-tight">
                Quick Message
              </h2>
            </div>
            <span className="font-code-sm text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              Encrypted
            </span>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mb-4">
            Drop a fast proposal, recruitment interview request, or inquiry directly into Shawon's priority inbox.
          </p>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-code-sm text-xs text-on-surface-variant flex items-center justify-between">
                <span>Your Name</span>
                <span className="text-error font-code-sm">*</span>
              </label>
              <div className="relative flex items-center">
                <AppIcon name="badge" className="w-[18px] h-[18px] absolute left-3 text-on-surface-variant pointer-events-none" />
                <input
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40 border border-white/5"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  type="text"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="font-code-sm text-xs text-on-surface-variant flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-error font-code-sm">*</span>
              </label>
              <div className="relative flex items-center">
                <AppIcon name="mail" className="w-[18px] h-[18px] absolute left-3 text-on-surface-variant pointer-events-none" />
                <input
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40 border border-white/5"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@company.com"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="font-code-sm text-xs text-on-surface-variant">Subject / Role Type</label>
              <div className="relative flex items-center">
                <AppIcon name="tune" className="w-[18px] h-[18px] absolute left-3 text-on-surface-variant pointer-events-none" />
                <select
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-xs sm:text-sm pl-10 pr-8 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all appearance-none border border-white/5"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Full-Time SWE Role (Frontend/Full-Stack)">
                    Full-Time SWE Role (Frontend/Full-Stack)
                  </option>
                  <option value="Contract / Milestone Project">Contract / Milestone Project</option>
                  <option value="Technical Collaboration / Open Source">
                    Technical Collaboration / Open Source
                  </option>
                  <option value="General Greetings">General Coffee Chat</option>
                </select>
                <AppIcon name="expand_more" className="w-[18px] h-[18px] absolute right-3 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1">
              <label className="font-code-sm text-xs text-on-surface-variant flex items-center justify-between">
                <span>Message Brief</span>
                <span className="text-error font-code-sm">*</span>
              </label>
              <textarea
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-xs sm:text-sm p-3 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40 resize-none border border-white/5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell Shawon about your product stack, interview timeline, or engineering goals..."
                required
                rows={3}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              className={`mt-1 w-full py-3 px-4 rounded-lg font-headline-md text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                submitSuccess
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary hover:bg-primary-container shadow-cyan-500/20'
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              <AppIcon
                name={submitSuccess ? 'check_circle' : 'send'}
                className="w-[18px] h-[18px]"
              />
              <span>
                {isSubmitting
                  ? 'Dispatching...'
                  : submitSuccess
                  ? 'Message Queued!'
                  : 'Send Message'}
              </span>
            </button>
          </form>
        </motion.div>

        {/* Resume Download & Quick Links Box */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 bg-surface-container-high rounded-xl p-4 sm:p-5 shadow-md mb-6 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
              <AppIcon name="description" className="w-[22px] h-[22px]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline-md text-sm sm:text-base text-on-surface font-bold truncate">
                  Curriculum Vitae
                </h3>
                <span className="font-code-sm text-[10px] text-primary bg-surface-container px-2 py-0.5 rounded border border-white/5">
                  PDF
                </span>
              </div>
              <span className="font-body-sm text-xs text-on-surface-variant">
                Updated for 2025 • Full Technical Profile
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest/60 rounded-lg p-3 flex items-center justify-between gap-2 mb-4 border border-white/5">
            <div className="flex flex-col">
              <span className="font-code-sm text-xs text-on-surface font-medium truncate">
                MD_Shawon_Molla_Resume.pdf
              </span>
              <span className="font-status-label text-[10px] text-on-surface-variant">
                Full-Stack &amp; Frontend Focus • 142 KB
              </span>
            </div>
            <AppIcon name="check_circle" className="w-5 h-5 text-secondary" />
          </div>
          <button
            onClick={onOpenResume}
            className="w-full py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-bright text-primary font-code-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm border border-white/5 cursor-pointer"
          >
            <AppIcon name="download" className="w-[18px] h-[18px]" />
            <span>Download Shawon's Full Resume</span>
          </button>
        </motion.div>

        {/* Professional Channels & Profiles */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-bold tracking-tight">
              Verified Channels
            </h3>
            <span className="font-code-sm text-xs text-on-surface-variant">Live Profiles</span>
          </div>
          <div className="flex flex-col gap-2">
            {/* LinkedIn */}
            <a
              className="group bg-surface-container p-3 sm:p-3.5 rounded-xl flex items-center justify-between shadow-sm hover:bg-surface-container-high transition-colors border border-white/5"
              href={PERSONAL_INFO.linkedinUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary border border-white/5">
                  <AppIcon name="hub" className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-md text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      LinkedIn
                    </span>
                    <AppIcon name="verified" className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-code-sm text-xs text-on-surface-variant truncate">
                    Connect &amp; Message directly
                  </span>
                </div>
              </div>
              <AppIcon
                name="arrow_forward"
                className="w-[18px] h-[18px] text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-transform"
              />
            </a>

            {/* GitHub */}
            <a
              className="group bg-surface-container p-3 sm:p-3.5 rounded-xl flex items-center justify-between shadow-sm hover:bg-surface-container-high transition-colors border border-white/5"
              href={PERSONAL_INFO.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary border border-white/5">
                  <AppIcon name="terminal" className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-md text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">
                      GitHub
                    </span>
                    <span className="font-code-sm text-[10px] text-secondary bg-secondary/10 px-1.5 py-0.2 rounded">
                      20+ Repos
                    </span>
                  </div>
                  <span className="font-code-sm text-xs text-on-surface-variant truncate">
                    Explore recent commits &amp; algorithms
                  </span>
                </div>
              </div>
              <AppIcon
                name="arrow_forward"
                className="w-[18px] h-[18px] text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-transform"
              />
            </a>

            {/* Portfolio / Live App */}
            <a
              className="group bg-surface-container p-3 sm:p-3.5 rounded-xl flex items-center justify-between shadow-sm hover:bg-surface-container-high transition-colors border border-white/5"
              href={PERSONAL_INFO.liveAppUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-tertiary border border-white/5">
                  <AppIcon name="web" className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-md text-sm font-semibold text-on-surface group-hover:text-tertiary transition-colors">
                      Odd Boundary
                    </span>
                    <span className="font-code-sm text-[10px] text-tertiary bg-tertiary/10 px-1.5 py-0.2 rounded">
                      Live Web App
                    </span>
                  </div>
                  <span className="font-code-sm text-xs text-on-surface-variant truncate">
                    oddboundary.lovable.app
                  </span>
                </div>
              </div>
              <AppIcon
                name="arrow_forward"
                className="w-[18px] h-[18px] text-on-surface-variant group-hover:text-tertiary group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          </div>
        </motion.div>

        {/* Interactive Workspace Terminal Card */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-inner font-code-sm border border-white/5 text-xs"
        >
          <div className="flex items-center justify-between pb-2 mb-2 text-on-surface-variant border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              <span className="ml-2 font-code-sm text-on-surface-variant">
                bash // contact.session
              </span>
            </div>
            <span className="text-secondary font-code-sm">200 OK</span>
          </div>
          <div className="text-on-surface-variant leading-relaxed">
            <p className="text-on-surface-variant/70">
              <span className="text-secondary">$</span> ssh visitor@shawon.dev
            </p>
            <p className="text-on-surface-variant/70">
              <span className="text-secondary">$</span> cat handshake_spec.json
            </p>
            <pre className="text-primary mt-1 font-code-sm whitespace-pre-wrap leading-tight text-xs bg-surface-container-low/50 p-2.5 rounded border border-white/5">
{`{
  "status": "ready_for_interviews",
  "timezone": "UTC+6 (Flexible overlap)",
  "preferred_stack": ["React", "TypeScript", "Node.js", "Tailwind"]
}`}
            </pre>
          </div>
        </motion.div>

        {/* Clean Footer */}
        <div className="relative z-10 pt-4 pb-6 text-center flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="font-status-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              Signal Active &amp; Monitored
            </span>
          </div>
          <p className="font-code-sm text-xs text-on-surface-variant">
            Designed &amp; Built for MD Shawon Molla · Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
};
