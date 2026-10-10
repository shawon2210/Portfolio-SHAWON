import React, { useRef, useState } from 'react';
import { Camera, X, Upload, Info, Check } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  currentAvatar: string;
  onClose: () => void;
  onUpdateAvatar: (dataUrl: string) => void;
  onResetAvatar: () => void;
  onShowToast: (msg: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  currentAvatar,
  onClose,
  onUpdateAvatar,
  onResetAvatar,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onShowToast('File size is too large (maximum 8 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = () => {
    if (preview) {
      onUpdateAvatar(preview);
      setPreview(null);
      onClose();
    }
  };

  const handleReset = () => {
    onResetAvatar();
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden font-sans">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface-container-high">
          <div className="flex items-center gap-2.5">
            <Camera className="text-primary w-5 h-5" />
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                Upload Custom Photo
              </h2>
              <span className="font-code-sm text-xs text-on-surface-variant">
                Update portrait across the portfolio
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex flex-col items-center gap-5">
          {/* Active / Preview Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-primary/40 shadow-xl bg-surface-container-lowest">
              <img
                src={preview || currentAvatar}
                alt="Profile Preview"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {preview && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-code-sm text-[10px] font-bold shadow">
                New Preview
              </span>
            )}
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-white/15 hover:border-primary/40 bg-surface-container-low'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="text-primary w-7 h-7" />
            <div className="flex flex-col gap-0.5">
              <span className="font-body-md text-xs sm:text-sm font-semibold text-on-surface">
                Click to browse or drag &amp; drop
              </span>
              <span className="font-code-sm text-[11px] text-on-surface-variant">
                Supports JPG, PNG, WEBP (Max 8 MB)
              </span>
            </div>
          </div>

          {/* Helper details */}
          <div className="w-full p-3 rounded-lg bg-surface-container-low border border-white/5 flex items-start gap-2.5 text-xs text-on-surface-variant">
            <Info className="text-primary w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your uploaded photo is preserved in your browser's local storage and reflected in the Hero, Resume, Header, and Contact sections.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/10 bg-surface-container-high">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-error font-code-sm text-xs transition-colors cursor-pointer"
          >
            Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-code-sm text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!preview}
              className={`px-4 py-2 rounded-lg font-code-sm text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                preview
                  ? 'bg-primary text-on-primary hover:bg-primary-container shadow-sm'
                  : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Apply Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
