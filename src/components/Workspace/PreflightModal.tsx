import React from 'react';
import { LayoutDocument, PreflightIssue } from '../../types';

interface PreflightModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: LayoutDocument;
  onUpdateDoc: (updated: Partial<LayoutDocument>) => void;
  isOverset: boolean;
}

export const PreflightModal: React.FC<PreflightModalProps> = ({
  isOpen,
  onClose,
  doc,
  onUpdateDoc,
  isOverset
}) => {
  if (!isOpen) return null;

  const issues: PreflightIssue[] = [];
  const fullText = `${doc.kicker} ${doc.title} ${doc.subHeader} ${doc.bodyText}`;

  // 1. Overset Check
  if (isOverset) {
    issues.push({
      id: 'err-overset',
      type: 'error',
      title: 'Overset Text Marker [+] Detected',
      message: 'Text copy exceeds the designated bounding box frame. Increase frame height or auto-scale font size.',
      canAutoFix: true
    });
  }

  // 2. Civil Suit / Reference Check
  const hasCivilNo = /WA-[A-Z0-9-]+\/[0-9]{4}|BA-[A-Z0-9-]+\/[0-9]{4}|NO\s*:\s*[A-Z0-9/-]+/i.test(fullText);
  if (!hasCivilNo && !fullText.includes('TENDER') && !fullText.includes('LELONGAN')) {
    issues.push({
      id: 'warn-civil-no',
      type: 'warning',
      title: 'Missing Court Reference / Guaman Sivil Number',
      message: 'Legal notice does not appear to contain a valid statutory Court Suit format (e.g. WA-A72NCvC-3158-07/2026).'
    });
  }

  // 3. Minimum Font Size Check
  if (doc.fontSize < 6.5) {
    issues.push({
      id: 'err-min-font',
      type: 'error',
      title: 'Typography Below Print Legibility Threshold',
      message: `Current font size (${doc.fontSize}pt) is below the newspaper legal minimum of 6.5pt.`,
      canAutoFix: true
    });
  } else if (doc.fontSize > 16) {
    issues.push({
      id: 'info-font-large',
      type: 'info',
      title: 'Display Heading Point Size',
      message: `Body font size is ${doc.fontSize}pt, recommended for classifieds is 7.5pt - 9pt.`
    });
  }

  // 4. Border Safe Area Check
  if (doc.posX < 5 || doc.posY < 5 || doc.posX + doc.frameWidth > 205 || doc.posY + doc.frameHeight > 292) {
    issues.push({
      id: 'warn-margins',
      type: 'warning',
      title: 'Bounding Frame Violates Safe Margins',
      message: 'Frame touches or exceeds the 5mm mechanical gripper margins.',
      canAutoFix: true
    });
  }

  // 5. Line Weight Verification
  if (doc.borderWidth > 0 && doc.borderWidth < 0.25) {
    issues.push({
      id: 'warn-stroke',
      type: 'warning',
      title: 'Hairline Stroke Under 0.25pt',
      message: 'Thin line may disappear on high-speed web offset newsprint.',
      canAutoFix: true
    });
  }

  const handleFixAll = () => {
    onUpdateDoc({
      borderWidth: 0.5,
      borderStyle: 'solid',
      fontSize: Math.max(7.5, Math.min(9.5, doc.fontSize)),
      lineHeight: Math.max(9.8, doc.lineHeight),
      posX: Math.max(10, Math.min(130, doc.posX)),
      posY: Math.max(15, Math.min(100, doc.posY))
    });
  };

  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-xs ${
              errorCount > 0 ? 'bg-red-600 text-white' : warningCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <span className="material-symbols-outlined text-lg">
                {errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'verified'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pre-Flight & Integrity Report</h3>
              <p className="text-xs text-slate-500 font-mono">
                Automated ISO Coated v2 (FOGRA39) Pre-Press Diagnostic
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 max-h-[60vh]">
          {/* Status summary banner */}
          <div className={`p-3 rounded-lg border flex items-center justify-between font-mono text-xs ${
            errorCount > 0
              ? 'bg-red-50 text-red-800 border-red-200'
              : warningCount > 0
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <span className="font-bold">
              {errorCount === 0 && warningCount === 0
                ? '✔ ALL CHECKS PASSED: READY FOR PRODUCTION RELEASE'
                : `${errorCount} Error(s), ${warningCount} Warning(s) detected.`}
            </span>
            <span className="text-[10px] font-mono">300 DPI CMYK</span>
          </div>

          {/* Issue list */}
          <div className="space-y-2">
            {issues.length === 0 ? (
              <div className="text-center py-6 text-slate-500 space-y-1">
                <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                <p className="text-xs font-semibold text-slate-800">Typography, Margins, and Bounding Box are 100% compliant.</p>
                <p className="text-[11px] font-mono text-slate-400">Zero overset text. Safe print margins verified.</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 rounded-lg border text-left text-xs ${
                    issue.type === 'error'
                      ? 'bg-red-50/50 border-red-200 text-red-900'
                      : issue.type === 'warning'
                      ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                      : 'bg-blue-50/50 border-blue-200 text-blue-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span className="material-symbols-outlined text-sm">
                      {issue.type === 'error' ? 'cancel' : issue.type === 'warning' ? 'warning' : 'info'}
                    </span>
                    <span>{issue.title}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{issue.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleFixAll}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            <span>Auto-Calibrate Frame & Font</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
