import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* VisionOS Volumetric Spatial Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-2xl transition-opacity animate-fade-in" 
        onClick={onClose} 
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        {/* Floating Spatial Modal Window */}
        <div
          className={`relative transform overflow-hidden rounded-[32px] spatial-window specular-rim text-left shadow-spatial-window transition-all sm:my-8 w-full ${maxWidth} z-10 border border-white/15`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.03]">
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 max-h-[82vh] overflow-y-auto text-slate-200">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
