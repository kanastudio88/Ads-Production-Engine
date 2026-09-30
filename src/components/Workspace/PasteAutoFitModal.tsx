import React, { useState } from 'react';
import { SAMPLE_COPIES } from '../../data/sampleCopies';
import { classifyAndAutoParseText } from '../../utils/textClassifier';

interface PasteAutoFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAutoFitText: (parsed: {
    kicker?: string;
    title: string;
    subHeader: string;
    bodyText: string;
    fontSize: number;
    lineHeight: number;
    columns?: number;
  }) => void;
}

export const PasteAutoFitModal: React.FC<PasteAutoFitModalProps> = ({
  isOpen,
  onClose,
  onApplyAutoFitText
}) => {
  const [inputText, setInputText] = useState(
    SAMPLE_COPIES[0].kicker +
      '\n\n' +
      SAMPLE_COPIES[0].title +
      '\n' +
      SAMPLE_COPIES[0].subHeader +
      '\n\n' +
      SAMPLE_COPIES[0].bodyText
  );

  const [selectedFormat, setSelectedFormat] = useState<'10x1' | '10x2' | '15x2'>('10x2');

  if (!isOpen) return null;

  const handleApply = () => {
    if (!inputText.trim()) return;

    const classified = classifyAndAutoParseText(
      inputText,
      selectedFormat === '10x1' ? 30 : 63,
      selectedFormat === '15x2' ? 150 : 100,
      selectedFormat === '10x1' ? 1 : 2
    );

    onApplyAutoFitText({
      kicker: classified.kicker,
      title: classified.title,
      subHeader: classified.subHeader,
      bodyText: classified.bodyText,
      fontSize: classified.recommendedFontSize,
      lineHeight: classified.recommendedLineHeight,
      columns: classified.recommendedColumns
    });

    onClose();
  };

  const classified = classifyAndAutoParseText(
    inputText,
    selectedFormat === '10x1' ? 30 : 63,
    selectedFormat === '15x2' ? 150 : 100,
    selectedFormat === '10x1' ? 1 : 2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-indigo-400 text-2xl">bolt</span>
            <div>
              <h2 className="font-bold text-sm tracking-wide">PASTE & AUTO-FIT INSPECTOR ENGINE</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Side-by-Side Live Typesetting Preview & Multi-Column Balancing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Top Preset Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-slate-600">PILIH FORMAT SASARAN:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectedFormat('10x1')}
                className={`px-3 py-1 font-mono font-bold rounded text-xs transition-colors cursor-pointer ${
                  selectedFormat === '10x1'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                10x1 (100x30mm · 1 Col)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('10x2')}
                className={`px-3 py-1 font-mono font-bold rounded text-xs transition-colors cursor-pointer ${
                  selectedFormat === '10x2'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                10x2 (100x63mm · 2 Col)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('15x2')}
                className={`px-3 py-1 font-mono font-bold rounded text-xs transition-colors cursor-pointer ${
                  selectedFormat === '15x2'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                15x2 (150x63mm · 2 Col)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-mono text-[11px] font-bold">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            <span>{classified.categoryLabel}</span>
          </div>
        </div>

        {/* Side-by-Side Dual-Pane Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 overflow-y-auto">
          {/* Left: Raw Text Input */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-bold text-slate-600 uppercase">
                1. RAW LEGAL / AD COPY
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} aksara
              </span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tampal teks kenyataan akhbar atau notis di sini..."
              className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Right: Live Preview Box */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-bold text-slate-600 uppercase">
                2. LIVE TYPESETTING PREVIEW (0.5pt Border)
              </label>
              <span className="text-[11px] font-mono text-indigo-600 font-bold">
                Font: {classified.recommendedFontSize}pt / {classified.recommendedLineHeight}pt
              </span>
            </div>

            <div className="flex-1 p-4 bg-white border border-slate-900 rounded-lg overflow-y-auto shadow-inner max-h-[340px] flex flex-col justify-between text-black select-none">
              <div className="space-y-2">
                {/* Court Kicker */}
                {classified.kicker && (
                  <div className="text-center font-bold text-[9px] uppercase leading-tight pb-1 border-b border-slate-200">
                    {classified.kicker.split('\n').map((k, i) => (
                      <div key={i}>{k}</div>
                    ))}
                  </div>
                )}

                {/* Title */}
                <div className="text-center">
                  <h3 className="font-bold text-xs uppercase underline tracking-tight">
                    {classified.title}
                  </h3>
                </div>

                {/* Body Preview */}
                <div
                  className={`grid gap-2 text-[8px] leading-snug text-justify font-sans`}
                  style={{
                    gridTemplateColumns:
                      selectedFormat === '10x1' ? '1fr' : 'repeat(2, minmax(0, 1fr))'
                  }}
                >
                  {classified.bodyText
                    .split('\n\n')
                    .slice(0, 4)
                    .map((p, pIdx) => (
                      <div key={pIdx} className="leading-tight">
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between font-mono text-[8px] text-slate-400">
                <span>100% OPTICAL BALANCE</span>
                <span>0.5pt BORDER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Terapkan Auto-Fit ke Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
