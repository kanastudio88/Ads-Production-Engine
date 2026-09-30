import React, { useState } from 'react';
import { LayoutDocument, ToolType, NewspaperGridMode, NUpMode, ViewportMode } from '../../types';
import { generateInDesignScript, exportLayoutToSvg } from '../../utils/idmlExport';
import { exportLayoutToImageProof } from '../../utils/pdfExport';
import { AD_PRESETS } from '../../data/adPresets';

interface ControlStripProps {
  doc: LayoutDocument;
  onUpdateDoc: (updated: Partial<LayoutDocument>) => void;
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onOpenPasteModal: () => void;
  onExportPdf: () => void;
  isExporting: boolean;
  onOpenPreflight: () => void;
  onOpenShortcuts: () => void;
  onOpenHistory?: () => void;
  onTakeSnapshot?: () => void;
  currentUserSeat?: string;
}

export const ControlStrip: React.FC<ControlStripProps> = ({
  doc,
  onUpdateDoc,
  activeTool,
  onSelectTool,
  onOpenPasteModal,
  onExportPdf,
  isExporting,
  onOpenPreflight,
  onOpenShortcuts,
  onOpenHistory,
  onTakeSnapshot,
  currentUserSeat = 'Alex Chen (DESK 01)'
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const handleExportJsx = () => {
    generateInDesignScript(doc);
    setShowExportMenu(false);
  };

  const handleExportSvg = () => {
    exportLayoutToSvg(doc);
    setShowExportMenu(false);
  };

  const handleExportPng = () => {
    exportLayoutToImageProof(doc, 'png');
    setShowExportMenu(false);
  };

  const currentPresetMatch = AD_PRESETS.find(
    (p) => p.widthMm === doc.frameWidth && p.heightMm === doc.frameHeight && p.columns === doc.columns
  );

  return (
    <div
      className={`w-full border-b select-none flex-shrink-0 text-xs transition-colors ${
        doc.themeMode === 'dark'
          ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
          : 'bg-[#f8fafc] border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Diagnostics & Export Strip */}
      <div
        className={`h-10 px-3 border-b flex flex-wrap items-center justify-between gap-2 transition-colors ${
          doc.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Left Badges */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Document Tab */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 text-white font-mono text-[11px] font-bold shadow-2xs">
            <span className="material-symbols-outlined text-[13px]">menu_book</span>
            <span>SPREAD 01 · MASTER A</span>
          </div>

          {/* Publication Selector */}
          <select
            value={doc.publicationName || 'BH'}
            onChange={(e) =>
              onUpdateDoc({
                publicationName: e.target.value as any
              })
            }
            className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-mono text-[11px] font-bold text-slate-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="BH">BERITA HARIAN (BH)</option>
            <option value="NST">NEW STRAITS TIMES (NST)</option>
            <option value="HM">HARIAN METRO (HM)</option>
            <option value="THE STAR">THE STAR</option>
            <option value="UTUSAN">UTUSAN MALAYSIA</option>
          </select>

          {/* Size readout */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-[11px] border ${
              doc.themeMode === 'dark'
                ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span>A4 · 210 x 297 mm</span>
          </div>

          {/* Preflight Interactive Pill */}
          <button
            onClick={onOpenPreflight}
            title="Click to inspect Pre-flight Diagnostic Report"
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-mono text-[11px] text-emerald-800 font-bold transition-colors cursor-pointer"
          >
            <span className="text-emerald-600 font-bold">/</span>
            <span>Pre-flight OK</span>
            <span className="material-symbols-outlined text-xs text-emerald-600">open_in_new</span>
          </button>

          {/* Active Seat Lock Badge */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 border border-indigo-200 font-mono text-[10px] text-indigo-900 font-semibold">
            <span className="material-symbols-outlined text-[12px] text-indigo-600">lock</span>
            <span>{doc.lockedBySeat || `Seat: ${currentUserSeat}`}</span>
          </div>
        </div>

        {/* Right Primary Actions */}
        <div className="flex items-center gap-2">
          {/* History / Snapshots */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              title="Version History & Snapshots"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-sans text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span className="hidden sm:inline">History</span>
            </button>
          )}

          {/* Paste & Auto-Fit Text */}
          <button
            onClick={onOpenPasteModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-md font-sans text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>Paste & Auto-Fit</span>
          </button>

          {/* Export Dropdown (.PDF / .PNG / .JSX / .SVG) */}
          <div className="relative">
            <div className="flex items-center">
              <button
                onClick={onExportPdf}
                disabled={isExporting}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-l-md font-sans text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                  isExporting ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isExporting ? 'sync' : 'download'}
                </span>
                <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
              </button>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                title="More Export Options (High-Res Image Proof, InDesign Script, SVG)"
                className="px-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-r-md border-l border-blue-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
              </button>
            </div>

            {showExportMenu && (
              <div className="absolute right-0 top-9 w-68 bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 text-slate-800">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Print & Proofing Pipeline
                </div>

                <button
                  onClick={onExportPdf}
                  className="w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-red-600 text-base">picture_as_pdf</span>
                  <div>
                    <div className="font-bold text-slate-900">Print-Ready PDF/X-1a</div>
                    <div className="text-[10px] text-slate-500 font-mono">300 DPI CMYK FOGRA39 Vector</div>
                  </div>
                </button>

                <button
                  onClick={handleExportPng}
                  className="w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-base">image</span>
                  <div>
                    <div className="font-bold text-slate-900">High-Res PNG Proof (300 DPI)</div>
                    <div className="text-[10px] text-slate-500 font-mono">WhatsApp & Client Verification</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJsx}
                  className="w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-indigo-600 text-base">code</span>
                  <div>
                    <div className="font-bold text-slate-900">InDesign CS5.5 Script (.jsx)</div>
                    <div className="text-[10px] text-slate-500 font-mono">Desktop InDesign Generator</div>
                  </div>
                </button>

                <button
                  onClick={handleExportSvg}
                  className="w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-amber-600 text-base">polyline</span>
                  <div>
                    <div className="font-bold text-slate-900">Vector SVG Layout</div>
                    <div className="text-[10px] text-slate-500 font-mono">Scalable Vector for Illustrator</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CS5.5 Tool Rack & Property Bar */}
      <div className="px-3 py-1.5 flex flex-wrap items-center justify-between gap-3 overflow-x-auto">
        {/* Left: Tools Rack + Typography Controls */}
        <div className="flex items-center gap-3">
          {/* Tool icons */}
          <div className="flex items-center bg-slate-200/80 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700 gap-0.5">
            <button
              onClick={() => onSelectTool('select')}
              title="Selection Tool (V)"
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">near_me</span>
            </button>

            <button
              onClick={() => onSelectTool('direct')}
              title="Direct Selection Tool (A)"
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                activeTool === 'direct'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">navigation</span>
            </button>

            <button
              onClick={() => onSelectTool('type')}
              title="Type Tool (T)"
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                activeTool === 'type'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">title</span>
            </button>

            <button
              onClick={() => onSelectTool('frame')}
              title="Rectangle Frame Tool (F)"
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                activeTool === 'frame'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">crop_square</span>
            </button>

            <button
              onClick={() => onSelectTool('hand')}
              title="Hand Tool (H / Space+Drag to Pan)"
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                activeTool === 'hand'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">pan_tool</span>
            </button>
          </div>

          {/* Preset Formats Quick Selector */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700">
            {['10x1', '10x2', '15x2', '20x2'].map((code) => {
              const preset = AD_PRESETS.find((p) => p.code === code);
              if (!preset) return null;
              const isSelected =
                doc.frameWidth === preset.widthMm &&
                doc.frameHeight === preset.heightMm &&
                doc.columns === preset.columns;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() =>
                    onUpdateDoc({
                      frameWidth: preset.widthMm,
                      frameHeight: preset.heightMm,
                      columns: preset.columns,
                      borderWidth: 0.5,
                      borderStyle: 'solid',
                      fontSize: preset.fontSize,
                      lineHeight: preset.lineHeight
                    })
                  }
                  title={`${preset.name}: ${preset.description}`}
                  className={`px-2 py-1 font-mono text-[10px] font-bold rounded transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* Typography & Word Document Formatting Controls */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300 dark:border-zinc-700">
            {/* Font Family */}
            <select
              value={doc.fontFamily}
              onChange={(e) => onUpdateDoc({ fontFamily: e.target.value })}
              className="px-2 py-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded text-xs font-serif font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
            >
              <option value="Helvetica">Helvetica / Arial (Standard)</option>
              <option value="Times New Roman">Times New Roman (Word/Editorial)</option>
              <option value="Calibri">Calibri (Modern Word)</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="Minion Pro">Minion Pro (Classical)</option>
              <option value="Garamond">Adobe Garamond (Literary)</option>
              <option value="Cinzel">Cinzel (Formal Proclamation)</option>
            </select>

            {/* Font Size & Leading */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <div className="flex items-center bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded px-1.5 py-0.5" title="Font Size (Tt)">
                <span className="text-slate-400 mr-1 text-[10px]">Tt</span>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="36"
                  value={doc.fontSize}
                  onChange={(e) => onUpdateDoc({ fontSize: parseFloat(e.target.value) || 5.2 })}
                  className="w-11 bg-transparent text-center focus:outline-none font-bold"
                />
                <span className="text-[9px] text-slate-400">pt</span>
              </div>

              <div className="flex items-center bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded px-1.5 py-0.5" title="Line Spacing / Leading">
                <span className="material-symbols-outlined text-slate-400 text-xs mr-0.5">format_line_spacing</span>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="48"
                  value={doc.lineHeight}
                  onChange={(e) => onUpdateDoc({ lineHeight: parseFloat(e.target.value) || 6.5 })}
                  className="w-11 bg-transparent text-center focus:outline-none font-bold"
                />
                <span className="text-[9px] text-slate-400">pt</span>
              </div>
            </div>

            {/* Word Formatting: Bold, Italic, Underline, Strikethrough */}
            <div className="flex items-center bg-slate-200/80 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700 gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('bold', false);
                  onUpdateDoc({ fontWeight: doc.fontWeight === 'bold' ? 'normal' : 'bold' });
                }}
                title="Bold (Ctrl+B) - Formats selected text or document"
                className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  doc.fontWeight === 'bold'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                B
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('italic', false);
                  onUpdateDoc({ isItalic: !doc.isItalic });
                }}
                title="Italic (Ctrl+I) - Formats selected text or document"
                className={`w-6 h-6 rounded italic font-serif text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  doc.isItalic
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                I
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('underline', false);
                  onUpdateDoc({ isUnderline: !doc.isUnderline });
                }}
                title="Underline (Ctrl+U) - Formats selected text or document"
                className={`w-6 h-6 rounded underline text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  doc.isUnderline
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                U
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('strikeThrough', false);
                  onUpdateDoc({ isStrikethrough: !doc.isStrikethrough });
                }}
                title="Strikethrough - Formats selected text or document"
                className={`w-6 h-6 rounded line-through text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  doc.isStrikethrough
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                S
              </button>
            </div>

            {/* Word Formatting: Text Alignments (Left, Center, Right, Justify) */}
            <div className="flex items-center bg-slate-200/80 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700 gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('justifyLeft', false);
                  onUpdateDoc({ alignment: 'left' });
                }}
                title="Align Left (Ctrl+L) - Formats selected text or document"
                className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                  doc.alignment === 'left'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">format_align_left</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('justifyCenter', false);
                  onUpdateDoc({ alignment: 'center' });
                }}
                title="Align Center (Ctrl+E) - Formats selected text or document"
                className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                  doc.alignment === 'center'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">format_align_center</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('justifyRight', false);
                  onUpdateDoc({ alignment: 'right' });
                }}
                title="Align Right (Ctrl+R) - Formats selected text or document"
                className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                  doc.alignment === 'right'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">format_align_right</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('justifyFull', false);
                  onUpdateDoc({ alignment: 'justify' });
                }}
                title="Justify (Ctrl+J) - Formats selected text or document"
                className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                  doc.alignment === 'justify' || !doc.alignment
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">format_align_justify</span>
              </button>
            </div>

            {/* Word Formatting: Text Case & Indents */}
            <div className="flex items-center gap-1">
              {/* Change Case Dropdown */}
              <select
                value={doc.textTransform || 'none'}
                onChange={(e) =>
                  onUpdateDoc({
                    textTransform: e.target.value as 'none' | 'uppercase' | 'lowercase' | 'capitalize'
                  })
                }
                title="Change Case (Aa)"
                className="px-1.5 py-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded text-[11px] font-bold text-slate-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="none">Aa Case</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="capitalize">Capitalize</option>
                <option value="lowercase">lowercase</option>
              </select>

              {/* First Line Indent (Increase / Decrease) */}
              <div className="flex items-center bg-slate-200/80 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700 gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDoc({
                      firstLineIndentMm: Math.max(0, (doc.firstLineIndentMm || 0) - 2)
                    })
                  }
                  title="Decrease First Line Indent"
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">format_indent_decrease</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDoc({
                      firstLineIndentMm: Math.min(20, (doc.firstLineIndentMm || 0) + 2)
                    })
                  }
                  title="Increase First Line Indent"
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">format_indent_increase</span>
                </button>
              </div>
            </div>

            {/* Border Thickness & Style */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded px-1.5 py-0.5 font-mono text-[11px]">
              <span className="text-slate-400 text-[9px]">Line:</span>
              <select
                value={doc.borderWidth || 0.5}
                onChange={(e) => onUpdateDoc({ borderWidth: parseFloat(e.target.value) || 0.5 })}
                className="bg-transparent font-bold focus:outline-none text-[11px]"
              >
                <option value="0.25">0.25 pt (Hairline)</option>
                <option value="0.5">0.5 pt (Notice)</option>
                <option value="0.75">0.75 pt</option>
                <option value="1.0">1.0 pt (Solid)</option>
                <option value="1.5">1.5 pt</option>
                <option value="2.0">2.0 pt (Bold)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Viewport Mode, Zoom & Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Viewport Modes */}
          <div className="flex items-center bg-slate-200/80 dark:bg-zinc-800 p-0.5 rounded border border-slate-300 dark:border-zinc-700 gap-0.5">
            <button
              onClick={() => onUpdateDoc({ viewportMode: 'normal' })}
              title="Drafting Mode (Rulers & Bounding Box)"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                doc.viewportMode === 'normal'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => onUpdateDoc({ viewportMode: 'newsprint' })}
              title="Newsprint Proofing Texture"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                doc.viewportMode === 'newsprint'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              Newsprint
            </button>
            <button
              onClick={() => onUpdateDoc({ viewportMode: 'print_preview' })}
              title="Clean Print Preview (W)"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                doc.viewportMode === 'print_preview'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-300/60'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded px-1.5 py-0.5 font-mono text-[11px]">
            <button
              onClick={() => onUpdateDoc({ zoom: Math.max(50, doc.zoom - 15) })}
              className="text-slate-500 hover:text-slate-900 px-1 font-bold cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center font-bold">{doc.zoom}%</span>
            <button
              onClick={() => onUpdateDoc({ zoom: Math.min(200, doc.zoom + 15) })}
              className="text-slate-500 hover:text-slate-900 px-1 font-bold cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Keyboard Shortcuts (?) */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts & CS5.5 Cheatsheet (?)"
            className="w-7 h-7 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-300 font-bold cursor-pointer"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
};
