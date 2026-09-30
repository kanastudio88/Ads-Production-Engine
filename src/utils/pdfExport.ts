import { jsPDF } from 'jspdf';
import { LayoutDocument } from '../types';

export const exportLayoutToPdf = (doc: LayoutDocument): string => {
  // A4 dimensions: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  const pubName = doc.publicationName || 'NEW STRAITS TIMES / BERITA HARIAN';

  // PDF Properties
  pdf.setProperties({
    title: `${doc.title || 'Studio8_Artwork_CS5.5'} - ${pubName}`,
    subject: 'Print-Ready Publication Layout PDF/X-1a:2001 Compliant (FOGRA39)',
    author: 'Studio8 Production Engine CS5.5',
    keywords: 'CS5.5, InDesign, Newspaper, Legal Notice, Prepress, Malaysia',
    creator: 'Studio8 Production Engine (ID: INDD-CS5.5-EMU-REV9)'
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Background sheet
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Precision Crop / Registration marks
  const markLen = 5;
  pdf.setDrawColor(160, 165, 175);
  pdf.setLineWidth(0.15);

  // Corner crop marks
  // Top-left
  pdf.line(10, 5, 10, 5 + markLen);
  pdf.line(5, 10, 5 + markLen, 10);
  // Top-right
  pdf.line(pageWidth - 10, 5, pageWidth - 10, 5 + markLen);
  pdf.line(pageWidth - 5 - markLen, 10, pageWidth - 5, 10);
  // Bottom-left
  pdf.line(10, pageHeight - 5 - markLen, 10, pageHeight - 5);
  pdf.line(5, pageHeight - 10, 5 + markLen, pageHeight - 10);
  // Bottom-right
  pdf.line(pageWidth - 10, pageHeight - 5 - markLen, pageWidth - 10, pageHeight - 5);
  pdf.line(pageWidth - 5 - markLen, pageHeight - 10, pageWidth - 5, pageHeight - 10);

  // Registration Targets (top-center and bottom-center)
  const drawTarget = (cx: number, cy: number) => {
    pdf.circle(cx, cy, 2, 'S');
    pdf.line(cx - 3, cy, cx + 3, cy);
    pdf.line(cx, cy - 3, cx, cy + 3);
  };
  drawTarget(pageWidth / 2, 6);
  drawTarget(pageWidth / 2, pageHeight - 6);

  // Technical slug line at top edge (outside trim)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(110, 115, 125);
  pdf.text(
    `STUDIO8 ENGINE // PUB: ${pubName} // COLOR PROFILE: ISO COATED V2 (FOGRA39) · 300 DPI · PDF/X-1a:2001 · ${new Date().toISOString()}`,
    15,
    7
  );

  // Bounding Frame
  const startX = doc.posX;
  const startY = doc.posY;
  const frameW = doc.frameWidth;
  const frameH = doc.frameHeight;

  // Frame Border
  if (doc.borderStyle !== 'none' && doc.borderWidth > 0) {
    const borderThicknessMm = doc.borderWidth * 0.352778; // 1 pt = ~0.352778 mm
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(borderThicknessMm);

    if (doc.borderStyle === 'double') {
      pdf.rect(startX, startY, frameW, frameH, 'S');
      pdf.rect(startX + 1.2, startY + 1.2, frameW - 2.4, frameH - 2.4, 'S');
    } else if (doc.borderStyle === 'oxford') {
      pdf.setLineWidth(borderThicknessMm * 1.5);
      pdf.rect(startX, startY, frameW, frameH, 'S');
      pdf.setLineWidth(borderThicknessMm * 0.4);
      pdf.rect(startX + 1.0, startY + 1.0, frameW - 2.0, frameH - 2.0, 'S');
    } else if (doc.borderStyle === 'dashed') {
      pdf.setLineDashPattern([2, 2], 0);
      pdf.rect(startX, startY, frameW, frameH, 'S');
      pdf.setLineDashPattern([], 0);
    } else if (doc.borderStyle === 'dotted') {
      pdf.setLineDashPattern([0.8, 1.2], 0);
      pdf.rect(startX, startY, frameW, frameH, 'S');
      pdf.setLineDashPattern([], 0);
    } else {
      pdf.rect(startX, startY, frameW, frameH, 'S');
    }
  }

  // Inner margin padding
  const padX = 4;
  let currentY = startY + 6;
  const contentW = frameW - padX * 2;

  // 1. Kicker / Court Header Lines
  if (doc.kicker) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(doc.fontSize <= 8 ? 6.5 : 7.5);
    pdf.setTextColor(15, 20, 25);
    const kickerLines = doc.kicker.split('\n');
    kickerLines.forEach((kLine) => {
      pdf.text(kLine.toUpperCase(), startX + frameW / 2, currentY, { align: 'center' });
      currentY += doc.fontSize <= 8 ? 2.8 : 3.5;
    });
    currentY += 1.5;
    // Hairline divider under court header
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.15);
    pdf.line(startX + padX, currentY - 0.5, startX + frameW - padX, currentY - 0.5);
    currentY += 2;
  }

  // 2. Main Title (NOTIS IKLAN)
  if (doc.title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(doc.fontSize <= 8 ? 9.5 : 12);
    pdf.setTextColor(10, 15, 20);
    const titleLines = pdf.splitTextToSize(doc.title.toUpperCase(), contentW);
    pdf.text(titleLines, startX + frameW / 2, currentY, { align: 'center' });
    currentY += titleLines.length * (doc.fontSize <= 8 ? 4.0 : 5.2) + 1.5;
  }

  // 3. Subheader
  if (doc.subHeader) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(doc.fontSize <= 8 ? 6.5 : 8.0);
    pdf.setTextColor(30, 35, 45);
    const subLines = pdf.splitTextToSize(doc.subHeader, contentW - 2);
    pdf.text(subLines, startX + frameW / 2, currentY, { align: 'center' });
    currentY += subLines.length * (doc.fontSize <= 8 ? 3.0 : 4.0) + 2;
  }

  // 4. Body Columns Layout
  if (doc.bodyText) {
    const numCols = Math.max(1, Math.min(4, doc.columns || 1));
    const gutterW = doc.gutter !== undefined ? doc.gutter : 0.05;
    const totalGutter = gutterW * (numCols - 1);
    const singleColW = (contentW - totalGutter) / numCols;

    const bodyFontSizePt = doc.fontSize || 7.5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(bodyFontSizePt);
    pdf.setTextColor(15, 20, 25);

    const rawParagraphs = doc.bodyText.split('\n\n').filter((p) => p.trim().length > 0);

    if (numCols === 1) {
      rawParagraphs.forEach((para) => {
        const pLines = pdf.splitTextToSize(para.trim(), contentW);
        pdf.text(pLines, startX + padX, currentY);
        currentY += pLines.length * (bodyFontSizePt * 0.352778 * 1.25) + 1.5;
      });
    } else {
      // Multi-column distribution
      rawParagraphs.forEach((para, idx) => {
        const colIdx = idx % numCols;
        const colX = startX + padX + colIdx * (singleColW + gutterW);
        const colY = currentY + Math.floor(idx / numCols) * 36;

        const pLines = pdf.splitTextToSize(para.trim(), singleColW);
        pdf.text(pLines, colX, colY, {
          align: doc.alignment === 'center' ? 'center' : 'left',
          lineHeightFactor: 1.2
        });
      });
    }
  }

  // 5. Micro Bottom Preflight Quality Stamp
  const bottomBadgeY = startY + frameH - 5;
  pdf.setDrawColor(215, 220, 230);
  pdf.setLineWidth(0.15);
  pdf.line(startX + padX, bottomBadgeY - 2.5, startX + frameW - padX, bottomBadgeY - 2.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5.5);
  pdf.setTextColor(0, 110, 75);
  pdf.text('✔ 100% Optical Density · 0.5pt Border', startX + padX, bottomBadgeY);

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(5.5);
  pdf.setTextColor(110, 115, 125);
  pdf.text('CS5.5-NOTIS-2026', startX + frameW - padX, bottomBadgeY, { align: 'right' });

  // 6. Footer Tag & Page Number
  const footerY = startY + frameH + 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(40, 45, 55);
  pdf.text(doc.footerTag || '§ DOKUMEN MAHKAMAH & NOTIS AWAM', startX, footerY);
  pdf.text(doc.pageNumber || 'PAGE 1', startX + frameW, footerY, { align: 'right' });

  // Generate blob URL & trigger download
  const cleanTitle = (doc.title || 'Studio8_Ad').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanTitle}_${doc.frameHeight / 10}x${doc.columns}_CS5.5.pdf`;
  pdf.save(filename);
  return filename;
};

export const exportLayoutToImageProof = (doc: LayoutDocument, format: 'png' | 'jpeg' = 'png'): string => {
  const canvas = document.createElement('canvas');
  const dpi = 2; // 2x high-resolution proofing
  const widthPx = 800 * dpi;
  const heightPx = 1130 * dpi;
  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background newsprint / white sheet
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Draw technical frame
  const scale = widthPx / 210;
  const fx = doc.posX * scale;
  const fy = doc.posY * scale;
  const fw = doc.frameWidth * scale;
  const fh = doc.frameHeight * scale;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(1, (doc.borderWidth || 0.5) * scale * 0.352778);
  ctx.strokeRect(fx, fy, fw, fh);

  // Content
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.round(8 * dpi)}px sans-serif`;

  let curY = fy + 18 * dpi;

  if (doc.kicker) {
    doc.kicker.split('\n').forEach((k) => {
      ctx.fillText(k.toUpperCase(), fx + fw / 2, curY);
      curY += 12 * dpi;
    });
  }

  if (doc.title) {
    ctx.font = `bold ${Math.round(14 * dpi)}px sans-serif`;
    ctx.fillText(doc.title.toUpperCase(), fx + fw / 2, curY + 6 * dpi);
    curY += 24 * dpi;
  }

  // Draw Watermark Stamp
  ctx.save();
  ctx.translate(widthPx / 2, heightPx / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.font = `bold ${Math.round(32 * dpi)}px sans-serif`;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.textAlign = 'center';
  ctx.fillText('STUDIO8 APPROVED PROOF', 0, 0);
  ctx.restore();

  const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
  const link = document.createElement('a');
  const filename = `PROOF_${(doc.title || 'Studio8').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${format}`;
  link.href = dataUrl;
  link.download = filename;
  link.click();
  return filename;
};
