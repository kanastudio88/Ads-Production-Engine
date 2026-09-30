import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Z', desc: 'Undo last layout edit' },
    { key: 'Ctrl + Y / ⇧⌘Z', desc: 'Redo layout change' },
    { key: 'Ctrl + E', desc: 'Export Print-Ready PDF/X-1a (300 DPI)' },
    { key: 'W', desc: 'Toggle Clean Preview Mode / Print Crop Marks' },
    { key: 'V', desc: 'Selection Tool (Move & 8-Point Frame Resize)' },
    { key: 'T', desc: 'Type Tool / Edit Raw Copy' },
    { key: 'F', desc: 'Rectangle Frame Tool' },
    { key: 'H / Space+Drag', desc: 'Hand Tool (Pan Viewport Canvas)' },
    { key: 'Ctrl + Alt + C', desc: 'Auto-Fit Frame to Text (Zero Overset)' },
    { key: 'Ctrl + / Ctrl -', desc: 'Zoom In / Zoom Out (50% - 200%)' },
    { key: 'Ctrl + 0', desc: 'Fit Spread to Viewport (100%)' },
    { key: '?', desc: 'Show this Keyboard Shortcuts Guide' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">keyboard</span>
            <h3 className="text-base font-bold text-slate-900">InDesign CS5.5 Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-2 max-h-[60vh]">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border-b border-slate-100 text-xs"
            >
              <span className="text-slate-700 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800 text-[11px] shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
