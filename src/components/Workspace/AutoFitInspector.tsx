import React, { useState } from 'react';
import { LayoutDocument } from '../../types';
import { SAMPLE_COPIES, SampleCopyTemplate } from '../../data/sampleCopies';
import { AD_PRESETS } from '../../data/adPresets';

interface AutoFitInspectorProps {
  doc: LayoutDocument;
  onUpdateDoc: (updated: Partial<LayoutDocument>) => void;
  rawText: string;
  onChangeRawText: (text: string) => void;
  onApplyAutoFit: (customText?: string) => void;
  isOverset: boolean;
  opticalDensity: number;
  onOpenPreflight: () => void;
}

export const AutoFitInspector: React.FC<AutoFitInspectorProps> = ({
  doc,
  onUpdateDoc,
  rawText,
  onChangeRawText,
  onApplyAutoFit
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);

  const handleSelectSample = (sample: SampleCopyTemplate) => {
    const fullCombined = `${sample.kicker ? sample.kicker + '\n\n' : ''}${sample.title}\n${sample.subHeader}\n\n${sample.bodyText}`;
    onChangeRawText(fullCombined);

    onUpdateDoc({
      kicker: sample.kicker,
      edition: sample.edition,
      subCategory: sample.subCategory,
      title: sample.title,
      subHeader: sample.subHeader,
      bodyText: sample.bodyText,
      footerTag: sample.footerTag,
      pageNumber: sample.pageNumber,
      columns: sample.columns,
      gutter: 0.05,
      fontSize: 5.2,
      lineHeight: 6.5,
      frameWidth: sample.preferredWidthMm || doc.frameWidth,
      frameHeight: sample.preferredHeightMm || doc.frameHeight,
      borderWidth: 0.5,
      borderStyle: 'solid',
      fontFamily: 'Helvetica',
      alignment: 'justify',
      dropCap: false
    });
    setShowSampleDropdown(false);
  };

  // Clean-up actions
  const handleCleanWhitespace = () => {
    const cleaned = rawText
      .split('\n')
      .map((l) => l.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .join('\n\n');
    onChangeRawText(cleaned);
    onApplyAutoFit(cleaned);
  };

  const handleFormatAllCapHeaders = () => {
    const lines = rawText.split('\n');
    if (lines.length > 0) {
      lines[0] = lines[0].toUpperCase();
      if (lines.length > 1 && lines[1].length < 40) {
        lines[1] = lines[1].toUpperCase();
      }
    }
    const updated = lines.join('\n');
    onChangeRawText(updated);
    onApplyAutoFit(updated);
  };

  const displayedPresets = showAllPresets ? AD_PRESETS : AD_PRESETS.slice(0, 6);

  return (
    <aside
      className={`w-80 border-l flex flex-col justify-between select-none flex-shrink-0 text-xs overflow-y-auto transition-colors ${
        doc.themeMode === 'dark'
          ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="p-4 space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[17px]">tune</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              AUTO-FIT INSPECTOR
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">
            CS5.5
          </span>
        </div>

        {/* Section: RAW UNFORMATTED COPY */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              RAW LEGAL / AD COPY
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                className="text-[11px] font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Pilih Templat ▾
              </button>

              {showSampleDropdown && (
                <div className="absolute right-0 top-6 w-72 bg-white rounded-md shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 text-slate-800">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Templat Notis Akhbar Rasmi
                  </div>
                  {SAMPLE_COPIES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="w-full text-left p-2 rounded hover:bg-slate-100 text-xs transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                    >
                      <div className="font-bold text-slate-900 truncate">{sample.name}</div>
                      <div className="text-[10px] text-blue-600 font-mono font-medium">
                        {sample.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            rows={7}
            value={rawText}
            onChange={(e) => {
              onChangeRawText(e.target.value);
              onApplyAutoFit(e.target.value);
            }}
            placeholder="Tampal teks notis guaman, lelongan atau tender di sini..."
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-[10.5px] text-slate-800 leading-relaxed focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 resize-none"
          />

          {/* Quick Clean Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCleanWhitespace}
                title="Trim extra whitespace"
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono font-medium cursor-pointer"
              >
                Trim Spaces
              </button>
              <button
                type="button"
                onClick={handleFormatAllCapHeaders}
                title="Capitalize headers"
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono font-medium cursor-pointer"
              >
                CAPS Headers
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              <span>{rawText.length} aksara · {rawText.split(/\s+/).filter(Boolean).length} perkataan</span>
            </div>
          </div>
        </div>

        {/* Section: COLUMN PRESETS & BORDER */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            SAIZ KOTAK IKLAN & PRESET
          </label>

          {/* Preset Buttons Grid */}
          <div>
            <div className="grid grid-cols-3 gap-1.5">
              {displayedPresets.map((preset) => {
                const isSelected =
                  doc.frameWidth === preset.widthMm &&
                  doc.frameHeight === preset.heightMm &&
                  doc.columns === preset.columns;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onUpdateDoc({
                        frameWidth: preset.widthMm,
                        frameHeight: preset.heightMm,
                        columns: 1, // run one (single column)
                        borderWidth: 0.5,
                        borderStyle: 'solid',
                        fontSize: 5.2, // 5.2pt standard text
                        lineHeight: 6.5,
                        gutter: 0.05 // 0.05mm standard micro-gutter between text boxes
                      });
                      onApplyAutoFit(rawText);
                    }}
                    title={`${preset.name}: ${preset.description}`}
                    className={`py-1.5 px-2 text-xs font-mono font-bold rounded border transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {preset.code}
                  </button>
                );
              })}
            </div>

            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowAllPresets(!showAllPresets)}
                className="text-[10px] font-mono text-blue-600 hover:underline cursor-pointer"
              >
                {showAllPresets ? '− Tunjuk Kurang' : '+ Format Lain (Full Page / Wide)'}
              </button>
            </div>
          </div>

          {/* Border Thickness */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-500 font-mono font-bold block mb-1">
              GARISAN BINGKAI (BORDER)
            </span>
            <select
              value={doc.borderWidth || 0.5}
              onChange={(e) =>
                onUpdateDoc({
                  borderWidth: parseFloat(e.target.value) || 0.5,
                  borderStyle: 'solid'
                })
              }
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:bg-white focus:outline-none font-bold"
            >
              <option value="0.25">0.25 pt (Hairline)</option>
              <option value="0.5">0.5 pt (Standard 0.5pt Line)</option>
              <option value="0.75">0.75 pt</option>
              <option value="1.0">1.0 pt (Solid)</option>
              <option value="1.5">1.5 pt</option>
              <option value="2.0">2.0 pt (Tebal)</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => onApplyAutoFit()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-sans text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[17px]">auto_fix_high</span>
          <span>Apply Auto-Fit to Frame</span>
        </button>
      </div>
    </aside>
  );
};
