import { useEffect, useRef } from 'react';

/**
 * Handles three modal a11y concerns:
 * 1. Body scroll lock while open
 * 2. Escape key closes the modal
 * 3. Focus is restored to the trigger element when the modal closes
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Capture the element that had focus before the modal opened
      triggerRef.current = document.activeElement;
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Restore focus to the triggering element
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
      triggerRef.current = null;
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);
}
