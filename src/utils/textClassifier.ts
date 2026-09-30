export interface ClassifiedTextResult {
  category: 'MAHKAMAH' | 'PENGGULUNGAN' | 'TENDER' | 'LELONGAN' | 'EDITORIAL' | 'AM';
  categoryLabel: string;
  kicker: string;
  edition: string;
  subCategory: string;
  title: string;
  subHeader: string;
  bodyText: string;
  recommendedFontSize: number;
  recommendedLineHeight: number;
  recommendedColumns: number;
  recommendedWidthMm?: number;
  recommendedHeightMm?: number;
  confidenceScore: number;
}

export const classifyAndAutoParseText = (
  rawText: string,
  frameWidthMm = 63,
  frameHeightMm = 150,
  currentColumns = 1
): ClassifiedTextResult => {
  const text = rawText.trim();
  const upper = text.toUpperCase();

  // 1. Check Malaysian Court Notice (Notis Iklan Mahkamah)
  if (
    upper.includes('DALAM MAHKAMAH') ||
    upper.includes('GUAMAN SIVIL') ||
    upper.includes('NOTIS IKLAN') ||
    upper.includes('SAMAN PEMULA') ||
    upper.includes('PLAINTIF') ||
    upper.includes('DEFENDAN')
  ) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let kicker = '';
    let title = 'NOTIS IKLAN';
    let subHeader = '';
    const bodyLines: string[] = [];

    // Extract court header lines
    const courtLines: string[] = [];
    let idx = 0;
    while (
      idx < lines.length &&
      (lines[idx].toUpperCase().includes('DALAM MAHKAMAH') ||
        lines[idx].toUpperCase().includes('WILAYAH') ||
        lines[idx].toUpperCase().includes('NEGERI') ||
        lines[idx].toUpperCase().includes('GUAMAN SIVIL') ||
        lines[idx].toUpperCase().includes('SAMAN PEMULA') ||
        lines[idx].toUpperCase().includes('NO:'))
    ) {
      courtLines.push(lines[idx]);
      idx++;
    }

    if (courtLines.length > 0) {
      kicker = courtLines.join('\n');
    } else {
      kicker = 'DALAM MAHKAMAH MAJISTRET DI KUALA LUMPUR\nGUAMAN SIVIL NO: WA-A72NCvC-3158-07/2026';
    }

    // Look for Title (e.g. NOTIS IKLAN)
    if (idx < lines.length && lines[idx].toUpperCase().includes('NOTIS')) {
      title = lines[idx].toUpperCase();
      idx++;
    }

    // Remaining lines into body
    while (idx < lines.length) {
      bodyLines.push(lines[idx]);
      idx++;
    }

    const bodyText = bodyLines.join('\n\n') || text;

    return {
      category: 'MAHKAMAH',
      categoryLabel: 'Notis Iklan Mahkamah (Guaman Sivil / Mahkamah)',
      kicker,
      edition: 'MAHKAMAH MAJISTRET / TINGGI · NOTIS RASMI',
      subCategory: 'NOTIS AWAM',
      title,
      subHeader: subHeader,
      bodyText,
      recommendedFontSize: 5.0, // standard 5pt
      recommendedLineHeight: 6.8,
      recommendedColumns: frameWidthMm >= 100 ? 3 : frameWidthMm >= 60 ? (frameHeightMm >= 140 ? 1 : 2) : 1,
      recommendedWidthMm: 63,
      recommendedHeightMm: 150,
      confidenceScore: 0.98
    };
  }

  // 2. Check Winding Up (Penggulungan Syarikat)
  if (
    upper.includes('PENGGULUNGAN') ||
    upper.includes('WINDING UP') ||
    upper.includes('AKTA SYARIKAT') ||
    upper.includes('SEKSYEN 465') ||
    upper.includes('PETISYEN')
  ) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      category: 'PENGGULUNGAN',
      categoryLabel: 'Notis Penggulungan Syarikat (Akta Syarikat 2016)',
      kicker: 'DALAM MAHKAMAH TINGGI MALAYA DI KUALA LUMPUR\nBAHAGIAN DAGANG\nPETISYEN PENGGULUNGAN SYARIKAT NO: WA-28NCC-412-08/2026',
      edition: 'NOTIS PENGGULUNGAN SYARIKAT',
      subCategory: 'PERDAGANGAN',
      title: 'NOTIS PETISYEN PENGGULUNGAN',
      subHeader: lines[1] || 'Dalam Perkara Seksyen 465 Akta Syarikat 2016',
      bodyText: lines.slice(2).join('\n\n') || text,
      recommendedFontSize: 5.0, // standard 5pt
      recommendedLineHeight: 6.8,
      recommendedColumns: frameWidthMm >= 90 ? 2 : 1,
      recommendedWidthMm: 63,
      recommendedHeightMm: 120,
      confidenceScore: 0.95
    };
  }

  // 3. Check Tender & Sebut Harga Kerajaan
  if (
    upper.includes('TENDER') ||
    upper.includes('SEBUT HARGA') ||
    upper.includes('KEMENTERIAN') ||
    upper.includes('JABATAN KERJA RAYA') ||
    upper.includes('LEMBAGA')
  ) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      category: 'TENDER',
      categoryLabel: 'Kenyataan Tender & Sebut Harga Rasmi',
      kicker: 'KEMENTERIAN PEMBANGUNAN KERAJAAN TEMPATAN\nJABATAN KERAJAAN TEMPATAN',
      edition: 'KENYATAAN TENDER AWAM',
      subCategory: 'PEROLEHAN KERAJAAN',
      title: lines[0] || 'KENYATAAN TAWARAN TENDER',
      subHeader: lines[1] || 'NO. TENDER: KPKT/T/048/2026',
      bodyText: lines.slice(2).join('\n\n') || text,
      recommendedFontSize: 5.0, // standard 5pt
      recommendedLineHeight: 6.8,
      recommendedColumns: frameWidthMm >= 90 ? 3 : 2,
      recommendedWidthMm: 96,
      recommendedHeightMm: 120,
      confidenceScore: 0.92
    };
  }

  // 4. Check Public Auction (Perisytiharan Jualan / Lelongan)
  if (
    upper.includes('PERISYTIHARAN JUALAN') ||
    upper.includes('LELONGAN AWAM') ||
    upper.includes('PELELONG BERLESEN') ||
    upper.includes('HAKMILIK')
  ) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      category: 'LELONGAN',
      categoryLabel: 'Perisytiharan Jualan & Lelongan Awam',
      kicker: 'PERISYTIHARAN JUALAN HARTANAH\nMENURUT PERINTAH MAHKAMAH TINGGI',
      edition: 'LELONGAN AWAM HARTANAH',
      subCategory: 'HARTANAH',
      title: lines[0] || 'PERISYTIHARAN JUALAN',
      subHeader: lines[1] || 'Lelongan Awam Melalui Pelelong Berlesen',
      bodyText: lines.slice(2).join('\n\n') || text,
      recommendedFontSize: 5.0, // standard 5pt
      recommendedLineHeight: 6.8,
      recommendedColumns: 2,
      recommendedWidthMm: 63,
      recommendedHeightMm: 150,
      confidenceScore: 0.94
    };
  }

  // 5. Generic Editorial or Classified
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let title = 'NOTIS AWAM';
  let subHeader = '';
  let body = text;

  if (lines.length >= 2) {
    title = lines[0];
    subHeader = lines[1];
    body = lines.slice(2).join('\n\n');
  } else if (lines.length === 1) {
    title = lines[0];
  }

  return {
    category: 'AM',
    categoryLabel: 'Notis Am / Classifieds',
    kicker: 'PEMBERITAHUAN AWAM',
    edition: 'EDISI AKHBAR HARIAN',
    subCategory: 'NOTIS UMUM',
    title,
    subHeader,
    bodyText: body,
    recommendedFontSize: 5.0, // standard 5pt
    recommendedLineHeight: 6.8,
    recommendedColumns: currentColumns || 1,
    confidenceScore: 0.75
  };
};
