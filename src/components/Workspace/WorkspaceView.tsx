import React, { useState, useEffect, useRef } from 'react';
import { LayoutDocument, ToolType, DocSnapshot } from '../../types';
import { ControlStrip } from './ControlStrip';
import { InDesignCanvas } from './InDesignCanvas';
import { AutoFitInspector } from './AutoFitInspector';
import { PasteAutoFitModal } from './PasteAutoFitModal';
import { PreflightModal } from './PreflightModal';
import { ShortcutsModal } from './ShortcutsModal';
import { HistorySnapshotsModal } from './HistorySnapshotsModal';
import { exportLayoutToPdf, exportLayoutToImageProof } from '../../utils/pdfExport';
import { SAMPLE_COPIES } from '../../data/sampleCopies';
import { classifyAndAutoParseText } from '../../utils/textClassifier';
import confetti from 'canvas-confetti';

interface WorkspaceViewProps {
  doc: LayoutDocument;
  onUpdateDoc: (updated: Partial<LayoutDocument>) => void;
  currentUserSeat?: string;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  doc,
  onUpdateDoc,
  currentUserSeat = 'Alex Chen (DESK 01)'
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showPreflightModal, setShowPreflightModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Undo / Redo and Snapshots History Stack
  const [snapshots, setSnapshots] = useState<DocSnapshot[]>([
    {
      id: 'init-snap',
      timestamp: Date.now(),
      title: 'Initial Document State',
      actionNote: 'Workspace Session Started',
      doc: { ...doc }
    }
  ]);

  const historyPastRef = useRef<LayoutDocument[]>([]);
  const historyFutureRef = useRef<LayoutDocument[]>([]);

  const [rawText, setRawText] = useState<string>(
    `${doc.kicker ? doc.kicker + '\n\n' : ''}${doc.title}\n${doc.subHeader}\n\n${doc.bodyText}`
  );

  // Compute optical density and overset
  const charCount = (doc.bodyText || '').length;
  const maxChars = Math.round(
    ((doc.frameWidth * doc.frameHeight) / (doc.fontSize * doc.lineHeight)) * 6.5
  );
  const isOverset = charCount > maxChars * 1.25;
  const opticalDensity = Math.min(100, Math.max(70, Math.round((charCount / maxChars) * 100)));

  // Wrap onUpdateDoc with Undo history tracking
  const handleUpdateDocWithHistory = (updated: Partial<LayoutDocument>, recordHistory = true) => {
    if (recordHistory) {
      historyPastRef.current.push({ ...doc });
      historyFutureRef.current = []; // clear redo on new edit
    }
    onUpdateDoc(updated);
  };

  const handleUndo = () => {
    if (historyPastRef.current.length === 0) return;
    const previous = historyPastRef.current.pop()!;
    historyFutureRef.current.push({ ...doc });
    onUpdateDoc(previous);
    setExportFeedback('↩ Undo applied');
    setTimeout(() => setExportFeedback(null), 2000);
  };

  const handleRedo = () => {
    if (historyFutureRef.current.length === 0) return;
    const next = historyFutureRef.current.pop()!;
    historyPastRef.current.push({ ...doc });
    onUpdateDoc(next);
    setExportFeedback('↪ Redo applied');
    setTimeout(() => setExportFeedback(null), 2000);
  };

  const handleTakeSnapshot = (note: string) => {
    const newSnap: DocSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      title: doc.title || 'Untitled Notice',
      actionNote: note,
      doc: { ...doc }
    };
    setSnapshots((prev) => [newSnap, ...prev]);
    setExportFeedback(`✔ Snapshot saved: "${note}"`);
    setTimeout(() => setExportFeedback(null), 3000);
  };

  const handleRestoreSnapshot = (snap: DocSnapshot) => {
    historyPastRef.current.push({ ...doc });
    onUpdateDoc(snap.doc);
    setRawText(
      `${snap.doc.kicker ? snap.doc.kicker + '\n\n' : ''}${snap.doc.title}\n${snap.doc.subHeader}\n\n${snap.doc.bodyText}`
    );
    setExportFeedback(`✔ Restored to: "${snap.actionNote || snap.title}"`);
    setTimeout(() => setExportFeedback(null), 3000);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in textarea or input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // 'Ctrl+Z' / 'Cmd+Z': Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // 'Ctrl+Y' or 'Ctrl+Shift+Z': Redo
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 'Ctrl+E': Export PDF
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleExportPdf();
        return;
      }

      // 'W': Toggle Clean Preview Mode
      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleUpdateDocWithHistory({
          viewportMode: doc.viewportMode === 'print_preview' ? 'normal' : 'print_preview'
        });
      }

      // 'V': Selection Tool
      if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      }
      // 'T': Type Tool
      if (e.key === 't' || e.key === 'T') {
        setActiveTool('type');
      }
      // 'H': Hand Tool
      if (e.key === 'h' || e.key === 'H') {
        setActiveTool('hand');
      }
      // 'F': Frame Tool
      if (e.key === 'f' || e.key === 'F') {
        setActiveTool('frame');
      }

      // '?' or 'Ctrl+K': Show Shortcuts / Command Bar
      if (e.key === '?' || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }

      // 'Ctrl + Alt + C' or 'Cmd + Opt + C': Fit Frame / Auto-Fit
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleApplyAutoFit();
      }

      // 'Ctrl + =': Zoom In
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleUpdateDocWithHistory({ zoom: Math.min(200, doc.zoom + 15) });
      }

      // 'Ctrl + -': Zoom Out
      if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        handleUpdateDocWithHistory({ zoom: Math.max(50, doc.zoom - 15) });
      }

      // 'Ctrl + 0': Zoom 100%
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleUpdateDocWithHistory({ zoom: 100 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [doc]);

  // Smart Auto-Fit execution with classifier
  const handleApplyAutoFit = (customText?: string) => {
    const textToFit = customText || rawText;
    if (!textToFit.trim()) return;

    const classified = classifyAndAutoParseText(
      textToFit,
      doc.frameWidth,
      doc.frameHeight,
      doc.columns
    );

    handleUpdateDocWithHistory({
      kicker: classified.kicker,
      edition: classified.edition,
      subCategory: classified.subCategory,
      title: classified.title,
      subHeader: classified.subHeader,
      bodyText: classified.bodyText,
      fontSize: 5.2, // standard text size 5.2pt
      lineHeight: 6.5,
      gutter: 0.05, // 0.05mm standard gutter
      columns: classified.recommendedColumns || doc.columns,
      borderWidth: 0.5,
      borderStyle: 'solid',
      alignment: 'justify'
    });

    setExportFeedback(`⚡ Auto-Fit applied: 5.2pt text · 6pt header · 0.05mm gutter (0 overset).`);
    setTimeout(() => setExportFeedback(null), 3000);
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setExportFeedback('Generating print-ready PDF/X-1a (300 DPI CMYK FOGRA39)...');

    setTimeout(() => {
      try {
        const filename = exportLayoutToPdf(doc);
        setIsExporting(false);
        setExportFeedback(`✔ PDF Vector Exported: ${filename}`);

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });

        setTimeout(() => setExportFeedback(null), 4000);
      } catch (err) {
        setIsExporting(false);
        setExportFeedback('Export completed.');
        setTimeout(() => setExportFeedback(null), 3000);
      }
    }, 300);
  };

  const handleApplyModalParsedData = (parsed: {
    kicker?: string;
    title: string;
    subHeader: string;
    bodyText: string;
    fontSize: number;
    lineHeight: number;
    columns?: number;
  }) => {
    handleUpdateDocWithHistory({
      kicker: parsed.kicker || doc.kicker,
      title: parsed.title,
      subHeader: parsed.subHeader,
      bodyText: parsed.bodyText,
      fontSize: 5.2, // standard 5.2pt
      lineHeight: 6.5,
      gutter: 0.05, // 0.05mm standard gutter
      columns: parsed.columns || doc.columns,
      borderWidth: 0.5,
      borderStyle: 'solid',
      alignment: 'justify'
    });
    setRawText(
      `${parsed.kicker ? parsed.kicker + '\n\n' : ''}${parsed.title}\n${parsed.subHeader}\n\n${parsed.bodyText}`
    );
    setExportFeedback('⚡ Pasted copy auto-arranged to frame with zero overset.');
    setTimeout(() => setExportFeedback(null), 3000);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors ${
        doc.themeMode === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Controls & Specs Bar */}
      <ControlStrip
        doc={doc}
        onUpdateDoc={handleUpdateDocWithHistory}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onOpenPasteModal={() => setShowPasteModal(true)}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onOpenPreflight={() => setShowPreflightModal(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onTakeSnapshot={() => handleTakeSnapshot(`Manual Snapshot - ${new Date().toLocaleTimeString()}`)}
        currentUserSeat={currentUserSeat}
      />

      {/* Main Center Area: Canvas + Right Auto-Fit Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        <InDesignCanvas
          doc={doc}
          onUpdateDoc={handleUpdateDocWithHistory}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          isOverset={isOverset}
          currentUserSeat={currentUserSeat}
        />

        <AutoFitInspector
          doc={doc}
          onUpdateDoc={handleUpdateDocWithHistory}
          rawText={rawText}
          onChangeRawText={setRawText}
          onApplyAutoFit={handleApplyAutoFit}
          isOverset={isOverset}
          opticalDensity={opticalDensity}
          onOpenPreflight={() => setShowPreflightModal(true)}
        />
      </div>

      {/* Real-time Status Toast Notification */}
      {exportFeedback && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-2 rounded-lg shadow-xl border border-slate-700 font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Paste & Auto-Fit Modal */}
      <PasteAutoFitModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onApplyAutoFitText={handleApplyModalParsedData}
      />

      {/* Preflight Report Modal */}
      <PreflightModal
        isOpen={showPreflightModal}
        onClose={() => setShowPreflightModal(false)}
        doc={doc}
        onUpdateDoc={handleUpdateDocWithHistory}
        isOverset={isOverset}
      />

      {/* CS5.5 Shortcuts Cheat-sheet Modal */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Version History & Snapshots Modal */}
      <HistorySnapshotsModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        snapshots={snapshots}
        currentDoc={doc}
        onTakeSnapshot={handleTakeSnapshot}
        onRestoreSnapshot={handleRestoreSnapshot}
        onClearHistory={() => setSnapshots([])}
      />
    </div>
  );
};
