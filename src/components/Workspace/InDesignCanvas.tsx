import React, { useState, useRef, useEffect } from 'react';
import { LayoutDocument, ToolType } from '../../types';

interface InDesignCanvasProps {
  doc: LayoutDocument;
  onUpdateDoc: (updated: Partial<LayoutDocument>) => void;
  activeTool: ToolType;
  onSelectTool?: (tool: ToolType) => void;
  isOverset: boolean;
  currentUserSeat?: string;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const InDesignCanvas: React.FC<InDesignCanvasProps> = ({
  doc,
  onUpdateDoc,
  activeTool,
  onSelectTool,
  isOverset,
  currentUserSeat = 'Alex Chen (DESK 01)'
}) => {
  const [cursorPos, setCursorPos] = useState<{ xMm: number; yMm: number }>({ xMm: 0, yMm: 0 });
  const [isDraggingFrame, setIsDraggingFrame] = useState(false);
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle | null>(null);

  // Pan canvas state
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: doc.panX || 0,
    y: doc.panY || 0
  });

  const panStartRef = useRef<{ startX: number; startY: number; initPanX: number; initPanY: number }>({
    startX: 0,
    startY: 0,
    initPanX: 0,
    initPanY: 0
  });

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initPosX: number;
    initPosY: number;
    initWidth: number;
    initHeight: number;
  }>({
    startX: 0,
    startY: 0,
    initPosX: doc.posX,
    initPosY: doc.posY,
    initWidth: doc.frameWidth,
    initHeight: doc.frameHeight
  });

  const isPreview = doc.viewportMode === 'preview' || doc.viewportMode === 'print_preview';
  const isNewsprint = doc.viewportMode === 'newsprint';

  // Handle Mouse Move for Rulers, Dragging and Resizing
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Pan mode with Hand tool or Spacebar drag
    if (isPanning) {
      const deltaX = e.clientX - panStartRef.current.startX;
      const deltaY = e.clientY - panStartRef.current.startY;
      setPanOffset({
        x: panStartRef.current.initPanX + deltaX,
        y: panStartRef.current.initPanY + deltaY
      });
      return;
    }

    const sheetEl = document.getElementById('a4-canvas-sheet');
    if (!sheetEl) return;
    const rect = sheetEl.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xMm = Math.max(0, Math.min(210, (clientX / rect.width) * 210));
    const yMm = Math.max(0, Math.min(297, (clientY / rect.height) * 297));
    setCursorPos({ xMm: Math.round(xMm), yMm: Math.round(yMm) });

    // 2. Dragging Frame Position
    if (isDraggingFrame && activeTool === 'select') {
      const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 210;
      const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 297;

      let newPosX = Math.max(4, Math.min(210 - doc.frameWidth - 4, dragStartRef.current.initPosX + deltaX));
      let newPosY = Math.max(4, Math.min(297 - doc.frameHeight - 4, dragStartRef.current.initPosY + deltaY));

      // Magnetic snap to standard margin (15mm, 20mm, 25mm)
      if (Math.abs(newPosX - 15) < 3) newPosX = 15;
      if (Math.abs(newPosX - 20) < 3) newPosX = 20;
      if (Math.abs(newPosY - 20) < 3) newPosY = 20;

      onUpdateDoc({
        posX: Math.round(newPosX),
        posY: Math.round(newPosY)
      });
    }

    // 3. Resizing Frame Dimensions via 8 Handles
    if (activeResizeHandle) {
      const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 210;
      const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 297;

      let newW = dragStartRef.current.initWidth;
      let newH = dragStartRef.current.initHeight;
      let newX = dragStartRef.current.initPosX;
      let newY = dragStartRef.current.initPosY;

      if (activeResizeHandle.includes('e')) {
        newW = Math.max(25, Math.min(210 - newX - 4, dragStartRef.current.initWidth + deltaX));
      }
      if (activeResizeHandle.includes('s')) {
        newH = Math.max(25, Math.min(297 - newY - 4, dragStartRef.current.initHeight + deltaY));
      }
      if (activeResizeHandle.includes('w')) {
        const potentialW = dragStartRef.current.initWidth - deltaX;
        if (potentialW >= 25 && dragStartRef.current.initPosX + deltaX >= 4) {
          newW = potentialW;
          newX = dragStartRef.current.initPosX + deltaX;
        }
      }
      if (activeResizeHandle.includes('n')) {
        const potentialH = dragStartRef.current.initHeight - deltaY;
        if (potentialH >= 25 && dragStartRef.current.initPosY + deltaY >= 4) {
          newH = potentialH;
          newY = dragStartRef.current.initPosY + deltaY;
        }
      }

      // Magnetic Snap to Newspaper Standard Sizes (30mm, 63mm, 96mm, 130mm width & 100mm, 150mm, 200mm height)
      if (Math.abs(newW - 30) < 3) newW = 30;
      else if (Math.abs(newW - 63) < 3) newW = 63;
      else if (Math.abs(newW - 96) < 3) newW = 96;
      else if (Math.abs(newW - 130) < 3) newW = 130;

      if (Math.abs(newH - 100) < 3) newH = 100;
      else if (Math.abs(newH - 150) < 3) newH = 150;
      else if (Math.abs(newH - 200) < 3) newH = 200;

      // Auto update columns if width stretched significantly
      let cols = doc.columns;
      if (newW < 45) cols = 1;
      else if (newW >= 45 && newW < 85) cols = 2;
      else if (newW >= 85 && newW < 120) cols = 3;
      else if (newW >= 120) cols = 4;

      onUpdateDoc({
        frameWidth: Math.round(newW),
        frameHeight: Math.round(newH),
        posX: Math.round(newX),
        posY: Math.round(newY),
        columns: cols
      });
    }
  };

  const handleFrameMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'hand') return;
    if (activeTool !== 'select' || isPreview) return;
    e.stopPropagation();
    setIsDraggingFrame(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: doc.posX,
      initPosY: doc.posY,
      initWidth: doc.frameWidth,
      initHeight: doc.frameHeight
    };
  };

  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    setActiveResizeHandle(handle);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: doc.posX,
      initPosY: doc.posY,
      initWidth: doc.frameWidth,
      initHeight: doc.frameHeight
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'hand' || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initPanX: panOffset.x,
        initPanY: panOffset.y
      };
    }
  };

  const handleMouseUp = () => {
    setIsDraggingFrame(false);
    setActiveResizeHandle(null);
    setIsPanning(false);
  };

  const getFontFamilyCss = () => {
    if (doc.fontFamily === 'Minion Pro' || doc.fontFamily === 'Times New Roman') {
      return '"Newsreader", "Times New Roman", "Minion Pro", Georgia, serif';
    }
    if (doc.fontFamily === 'Garamond') return '"Adobe Garamond", "Garamond", "Georgia", serif';
    if (doc.fontFamily === 'Caslon') return '"Caslon Pro", "Caslon", Georgia, serif';
    if (doc.fontFamily === 'Cinzel') return '"Cinzel", "Times New Roman", serif';
    if (doc.fontFamily === 'Helvetica') return '"Inter", "Helvetica Neue", Arial, sans-serif';
    return '"Inter", Arial, sans-serif';
  };

  const paragraphs = (doc.bodyText || '').split('\n\n').filter((p) => p.trim().length > 0);

  const xTicks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 210];
  const yTicks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 297];

  // Render a Single Ad Box with Authentic Typography
  const renderAdBox = (scale = 1, isSecondary = false) => {
    const isTypeTool = activeTool === 'type';

    return (
      <div
        onMouseDown={!isSecondary && !isTypeTool ? handleFrameMouseDown : undefined}
        onDoubleClick={() => {
          if (!isSecondary && onSelectTool) {
            onSelectTool('type');
          }
        }}
        className={`relative transition-shadow duration-75 ${
          isTypeTool ? 'cursor-text select-text ring-1 ring-blue-500/80 shadow-md' : 'select-none'
        } ${
          !isPreview && activeTool === 'select' && !isSecondary ? 'cursor-move' : ''
        } ${isDraggingFrame && !isSecondary ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          border:
            doc.borderStyle === 'double'
              ? '3px double #000000'
              : doc.borderStyle === 'oxford'
              ? '3px solid #000000'
              : doc.borderStyle === 'dashed'
              ? '1px dashed #000000'
              : doc.borderStyle === 'dotted'
              ? '1px dotted #000000'
              : doc.borderStyle === 'none'
              ? isPreview ? 'none' : '1px dashed #cbd5e1'
              : `${doc.borderWidth || 0.5}px solid #000000`
        }}
      >
        {/* 8-Point Interactive Resizing Transform Handles */}
        {!isPreview && !isSecondary && !isTypeTool && (
          <>
            {/* Corner Handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
              className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white cursor-nwse-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize NW"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
              className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white cursor-nesw-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize NE"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white cursor-nwse-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize SE"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
              className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white cursor-nesw-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize SW"
            />

            {/* Edge Midpoint Handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'n')}
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 border border-white cursor-ns-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize Height (Top)"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 's')}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 border border-white cursor-ns-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize Height (Bottom)"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'w')}
              className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 border border-white cursor-ew-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize Width (Left)"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 border border-white cursor-ew-resize shadow-xs hover:scale-125 transition-transform z-30"
              title="Resize Width (Right)"
            />
          </>
        )}

        {/* Type Tool Active Header Badge */}
        {isTypeTool && !isSecondary && (
          <div className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white font-sans text-[10px] font-bold shadow-xs whitespace-nowrap z-30 animate-pulse">
            <span className="material-symbols-outlined text-[13px]">title</span>
            <span>Type Tool Active · Click & Drag to Select Text · Click to Edit</span>
          </div>
        )}

        {/* Live Dimension & Seat Pill Header */}
        {!isPreview && !isSecondary && !isTypeTool && (
          <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[9px] font-bold shadow-xs whitespace-nowrap z-30">
            <span className="text-emerald-400">●</span>
            <span>{doc.frameHeight / 10}x{doc.columns} ({doc.frameHeight}mm H x {doc.frameWidth}mm W)</span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-300">{doc.borderWidth || 0.5}pt</span>
          </div>
        )}

        {/* Overset Text Indicator Badge */}
        {!isPreview && !isSecondary && (
          isOverset ? (
            <div
              title="Overset Text Marker [+]: Text overflow! Click Auto-Fit or decrease font size."
              className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-red-600 text-white font-mono text-[12px] font-bold flex items-center justify-center rounded shadow-lg animate-bounce border-2 border-white z-30"
            >
              +
            </div>
          ) : (
            <div
              title="Zero Overset · 100% Optical Density"
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center rounded-xs shadow-xs border border-white z-30"
            >
              ✓
            </div>
          )
        )}

        {/* Word-Style Interactive Tab Ruler above the text box */}
        {!isPreview && (
          <div
            className="absolute -top-7 left-0 right-0 h-6 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-t flex items-center px-2 select-none z-30 shadow-xs"
            title="Tab & Indent Ruler - Supports manual Tab key & indents"
          >
            <div className="flex-1 relative h-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xs flex items-center overflow-hidden">
              {/* Millimeter Ticks along Ruler */}
              {Array.from({ length: Math.ceil(doc.frameWidth / 10) + 1 }).map((_, cmIdx) => (
                <div
                  key={cmIdx}
                  className="absolute top-0 bottom-0 border-l border-slate-400 dark:border-zinc-500 text-[7px] font-mono text-slate-500 pl-0.5"
                  style={{ left: `${(cmIdx * 10 / doc.frameWidth) * 100}%` }}
                >
                  {cmIdx}
                </div>
              ))}

              {/* First Line Indent Marker ▼ */}
              <div
                className="absolute top-0 w-2 h-2 -ml-1 text-blue-600 cursor-ew-resize flex items-center justify-center font-bold text-[8px]"
                style={{ left: `${Math.min(90, Math.max(0, ((doc.firstLineIndentMm || 0) / doc.frameWidth) * 100))}%` }}
                title={`First Line Indent: ${doc.firstLineIndentMm || 0}mm (Drag or use Indent buttons)`}
              >
                ▼
              </div>

              {/* Tab Stop Indicators */}
              <div className="absolute top-0.5 bottom-0.5 left-1/4 w-0.5 bg-blue-400 opacity-60" title="Tab Stop 1 (25%)" />
              <div className="absolute top-0.5 bottom-0.5 left-1/2 w-0.5 bg-blue-400 opacity-60" title="Tab Stop 2 (50%)" />
              <div className="absolute top-0.5 bottom-0.5 left-3/4 w-0.5 bg-blue-400 opacity-60" title="Tab Stop 3 (75%)" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 ml-1.5 font-bold">RULER (mm)</span>
          </div>
        )}

        {/* Inside Layout Content (100% Free-form Ungrouped Manual Text Box with Tab Key Support) */}
        <div
          contentEditable={isTypeTool}
          suppressContentEditableWarning
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              // Insert 4 non-breaking spaces or real tab at cursor
              document.execCommand('insertText', false, '    ');
            }
          }}
          onBlur={(e) => {
            if (isTypeTool) {
              onUpdateDoc({ bodyText: e.currentTarget.innerText });
            }
          }}
          className={`w-full h-full flex flex-col justify-start overflow-auto text-black transition-colors ${
            isNewsprint ? 'bg-[#f4efe4]' : 'bg-white'
          } ${
            isTypeTool
              ? 'select-text cursor-text outline-none ring-2 ring-blue-500 p-3'
              : 'select-none p-3'
          }`}
          style={{
            fontFamily: getFontFamilyCss(),
            fontSize: `${doc.fontSize || 5.2}pt`,
            lineHeight: `${doc.lineHeight || 6.5}pt`,
            fontWeight: doc.fontWeight === 'bold' ? 'bold' : 'normal',
            fontStyle: doc.isItalic ? 'italic' : 'normal',
            textDecoration: `${doc.isUnderline ? 'underline ' : ''}${doc.isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
            textTransform: doc.textTransform && doc.textTransform !== 'none' ? doc.textTransform : undefined,
            color: doc.textColor || undefined,
            backgroundColor: doc.textHighlight && doc.textHighlight !== 'none' ? doc.textHighlight : undefined,
            textAlign:
              doc.alignment === 'center'
                ? 'center'
                : doc.alignment === 'right'
                ? 'right'
                : doc.alignment === 'left'
                ? 'left'
                : 'justify',
            textJustify: doc.alignment === 'justify' || !doc.alignment ? 'inter-word' : undefined,
            textIndent: doc.firstLineIndentMm ? `${doc.firstLineIndentMm}mm` : undefined,
            tabSize: 4,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {/* Pure, Ungrouped, 100% Manually Adjustable Content */}
          {doc.bodyText ? (
            <div className="w-full whitespace-pre-wrap leading-tight">
              {doc.bodyText}
            </div>
          ) : (
            <div className="w-full whitespace-pre-wrap leading-tight">
              {doc.kicker && `${doc.kicker}\n\n`}
              {doc.title && `${doc.title}\n\n`}
              {doc.subHeader && `${doc.subHeader}\n\n`}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex-1 relative overflow-auto flex flex-col items-center justify-start select-none transition-colors ${
        doc.themeMode === 'dark'
          ? 'bg-[#18181b]'
          : isNewsprint
          ? 'bg-[#e2ded5]'
          : 'bg-[#d8dbe2]'
      } ${activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Top Horizontal Millimeter Ruler */}
      {!isPreview && (
        <div className="sticky top-0 left-0 w-full h-5 bg-[#e9ecf2] border-b border-slate-300 z-20 flex items-center shadow-2xs">
          <div className="w-6 h-full bg-[#dfe3eb] border-r border-slate-300 flex items-center justify-center font-mono text-[8px] text-slate-500">
            mm
          </div>
          <div className="relative flex-1 h-full overflow-hidden">
            {xTicks.map((tick) => (
              <div
                key={tick}
                className="absolute top-0 flex flex-col items-center text-[9px] font-mono text-slate-500"
                style={{ left: `${(tick / 210) * 100}%` }}
              >
                <div className="h-2 w-[1px] bg-slate-400"></div>
                <span className="leading-none text-[8px] -ml-2">{tick}</span>
              </div>
            ))}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-blue-600 pointer-events-none z-30"
              style={{ left: `${(cursorPos.xMm / 210) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Center Canvas Drafting Viewport */}
      <div className="flex w-full flex-1 relative">
        {/* Left Vertical Millimeter Ruler */}
        {!isPreview && (
          <div className="sticky left-0 top-0 w-6 bg-[#e9ecf2] border-r border-slate-300 z-10 flex flex-col">
            <div className="relative flex-1 w-full">
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="absolute left-0 flex items-center text-[8px] font-mono text-slate-500"
                  style={{ top: `${(tick / 297) * 100}%` }}
                >
                  <div className="w-2 h-[1px] bg-slate-400"></div>
                  <span className="leading-none text-[8px] ml-0.5">{tick}</span>
                </div>
              ))}
              <div
                className="absolute left-0 right-0 h-[1px] bg-blue-600 pointer-events-none z-30"
                style={{ top: `${(cursorPos.yMm / 297) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* The White/Newsprint Drafting Sheet */}
        <div className="flex-1 p-6 md:p-10 flex items-center justify-center min-w-[720px]">
          <div
            id="a4-canvas-sheet"
            className={`shadow-2xl relative transition-transform duration-100 ${
              isNewsprint ? 'bg-[#fcfaf2]' : 'bg-white'
            }`}
            style={{
              width: '630px',
              height: '891px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${doc.zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Print Preview Crop Marks outside sheet */}
            {doc.viewportMode === 'print_preview' && (
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-0.5 bg-slate-900"></div>
                <div className="absolute top-0 left-0 w-0.5 h-4 bg-slate-900"></div>
                <div className="absolute top-0 right-0 w-4 h-0.5 bg-slate-900"></div>
                <div className="absolute top-0 right-0 w-0.5 h-4 bg-slate-900"></div>
                <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-slate-900"></div>
                <div className="absolute bottom-0 left-0 w-0.5 h-4 bg-slate-900"></div>
                <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-slate-900"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-slate-900"></div>
              </div>
            )}

            {/* Margin Bleed Guides */}
            {!isPreview && (
              <div
                className="absolute pointer-events-none border border-cyan-400/40"
                style={{
                  top: '18px',
                  left: '20px',
                  right: '20px',
                  bottom: '22px'
                }}
              />
            )}

            {/* Broadsheet 8-Column / Tabloid 6-Column Newspaper Grid Rails */}
            {!isPreview && doc.newspaperGrid !== 'none' && (
              <div
                className="absolute inset-0 pointer-events-none p-5 grid gap-2 opacity-30 z-0"
                style={{
                  gridTemplateColumns:
                    doc.newspaperGrid === 'broadsheet' ? 'repeat(8, 1fr)' : 'repeat(6, 1fr)'
                }}
              >
                {Array.from({ length: doc.newspaperGrid === 'broadsheet' ? 8 : 6 }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="h-full bg-blue-100/50 border-x border-blue-300/40 flex items-start justify-center pt-1"
                  >
                    <span className="font-mono text-[7px] text-blue-700 font-bold">Col {colIdx + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Baseline Grid lines */}
            {!isPreview && doc.snapBaselineGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden z-0">
                {Array.from({ length: 55 }).map((_, i) => (
                  <div key={i} className="w-full border-b border-blue-200" style={{ height: '16px' }} />
                ))}
              </div>
            )}

            {/* Single Dynamic Ad Frame - Brought to front (z-20) and fully adjustable */}
            <div
              className="absolute z-20 group"
              style={{
                left: `${(doc.posX / 210) * 100}%`,
                top: `${(doc.posY / 297) * 100}%`,
                width: `${(doc.frameWidth / 210) * 100}%`,
                height: `${(doc.frameHeight / 297) * 100}%`
              }}
            >
              {renderAdBox(1, false)}
            </div>

            {/* Bottom Footer Review Sheet Line */}
            <div
              className="absolute left-6 right-6 bottom-4 flex items-center justify-between font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wider"
              style={{ top: '855px' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">§</span>
                <span>{doc.footerTag || 'DOKUMEN MAHKAMAH & NOTIS AWAM'}</span>
              </div>
              <div className="font-sans font-black text-slate-900">
                {doc.pageNumber || 'PAGE 1'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
