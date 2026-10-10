import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TabType } from '../types';
import { useModalA11y } from '../hooks/useModalA11y';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
}

interface CommandHistory {
  cmd: string;
  output: React.ReactNode;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowToast,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      cmd: 'init',
      output: (
        <div className="space-y-1">
          <p className="text-secondary font-semibold">
            ⚡ Shawon.dev Interactive Terminal v2.4 initialized.
          </p>
          <p className="text-on-surface-variant">
            Type <span className="text-primary font-bold">help</span> to list available commands.
          </p>
        </div>
      ),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useModalA11y(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-primary font-bold">Available Commands:</p>
            <p><span className="text-secondary w-20 inline-block font-mono">projects</span> - View engineered systems</p>
            <p><span className="text-secondary w-20 inline-block font-mono">experience</span> - View timeline &amp; degrees</p>
            <p><span className="text-secondary w-20 inline-block font-mono">contact</span> - Open contact information</p>
            <p><span className="text-secondary w-20 inline-block font-mono">verify</span> - Run academic &amp; SWE validation</p>
            <p><span className="text-secondary w-20 inline-block font-mono">whoami</span> - Display developer profile</p>
            <p><span className="text-secondary w-20 inline-block font-mono">clear</span> - Clear terminal session</p>
            <p><span className="text-secondary w-20 inline-block font-mono">exit</span> - Close terminal window</p>
          </div>
        );
        break;

      case 'whoami':
      case 'bio':
        output = (
          <div className="text-xs space-y-1 text-on-surface-variant">
            <p className="text-primary font-bold">{PERSONAL_INFO.name}</p>
            <p>{PERSONAL_INFO.title}</p>
            <p className="text-on-surface">{PERSONAL_INFO.bio}</p>
          </div>
        );
        break;

      case 'projects':
        onNavigate('projects');
        onClose();
        onShowToast('Navigating to Projects catalog...');
        return;

      case 'experience':
        onNavigate('experience');
        onClose();
        onShowToast('Navigating to Experience & Education...');
        return;

      case 'contact':
        onNavigate('contact');
        onClose();
        onShowToast('Navigating to Contact view...');
        return;

      case 'verify':
      case 'run verify':
        output = (
          <div className="space-y-1 text-xs text-secondary">
            <p>✔ Academic record: BSc CSE (2026) | GPA 5.00/5.00 (HSC &amp; SSC)</p>
            <p>✔ Production experience: Innofast Tech (Lighthouse +27, Page Load -30%)</p>
            <p>✔ Certifications: 80-Hour Django Web Framework (BCC Accredited)</p>
            <p className="text-primary-fixed">Status: Fully Qualified for Full-Stack &amp; Frontend roles.</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        output = (
          <p className="text-error text-xs">
            Command not recognized: <span className="font-mono">{trimmed}</span>. Type <span className="text-primary font-bold">help</span>.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { cmd: inputVal, output }]);
    setInputVal('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-xl h-[480px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-primary/20 flex flex-col overflow-hidden font-code-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="ml-2 text-xs text-on-surface-variant font-medium">
              shawon@shawon-dev: ~
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.cmd !== 'init' && (
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="text-secondary">$</span>
                  <span className="text-on-surface">{item.cmd}</span>
                </div>
              )}
              <div>{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input */}
        <form onSubmit={handleCommand} className="p-3 bg-surface-container-low border-t border-white/5 flex items-center gap-2">
          <span className="text-secondary font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' or command..."
            className="flex-1 bg-transparent text-primary outline-none font-code-sm text-xs placeholder:text-on-surface-variant/40"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-[11px]"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};
