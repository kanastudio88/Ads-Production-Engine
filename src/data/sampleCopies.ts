export interface SampleCopyTemplate {
  id: string;
  name: string;
  category: string;
  kicker: string;
  edition: string;
  subCategory: string;
  title: string;
  subHeader: string;
  bodyText: string;
  footerTag: string;
  pageNumber: string;
  columns: number;
  gutter: number;
  fontSize: number;
  lineHeight: number;
  preferredWidthMm?: number;
  preferredHeightMm?: number;
}

export const SAMPLE_COPIES: SampleCopyTemplate[] = [
  {
    id: 'notis-iklan-mahkamah',
    name: 'Notis Iklan Mahkamah (Writ Saman)',
    category: 'Notis Mahkamah',
    kicker: 'DALAM MAHKAMAH MAJISTRET DI KUALA LUMPUR\nDALAM WILAYAH PERSEKUTUAN KUALA LUMPUR, MALAYSIA\nGUAMAN SIVIL NO: WA-A72NCvC-3158-07/2026',
    edition: 'MAHKAMAH MAJISTRET KUALA LUMPUR · BAHAGIAN SIVIL',
    subCategory: 'GUAMAN NO: WA-A72NCvC-3158-07/2026',
    title: 'NOTIS IKLAN',
    subHeader: '(Dalam perkara mengenai Writ Saman bertarikh 31 Julai 2026)',
    bodyText: `ANTARA
LEMBAGA KUMPULAN WANG SIMPANAN PEKERJA …PLAINTIF
DAN
1. PUNCAK JAYA PETROLEUM SDN. BHD. (773851-K)
2. MOHD JAYA JAYANDRAN BIN AL BAKRI
(NO. K/P: 660320-04-5309)
3. SHARIFAH FARAH MAHERAN BINTI NOOR OSMAN
(NO. K/P: 760210-12-5998)
...DEFENDAN-DEFENDAN

Kepada:-
1. MOHD JAYA JAYANDRAN BIN AL BAKRI
3-10-3, Seri Desa Condo, Jalan 1/116B, Off Kuchai Lama, 58200 Kuala Lumpur
Dan/atau
MOHD JAYA JAYANDRAN BIN AL BAKRI
No. 9, Jalan Pimping, Ukay Heights, 68000 Ampang, Selangor

2. SHARIFAH FARAH MAHERAN BINTI NOOR OSMAN
No. 9, Jalan Pimping, Ukay Heights, 68000 Ampang, Selangor

AMBIL PERHATIAN bahawa suatu Writ Saman telah dikeluarkan terhadap kamu di Mahkamah Majistret di Kuala Lumpur oleh LEMBAGA KUMPULAN WANG SIMPANAN PEKERJA yang beralamat berdaftarnya di Menara KWSP No. 1, Persiaran Kwasa Utama, Kwasa Damansara, Seksyen U4, 40150 Shah Alam, Selangor Darul Ehsan dan Mahkamah telah memerintah bahawa Writ Saman bertarikh 31 Julai 2026 tersebut disampaikan kepada Defendan Kedua dan Defendan Ketiga dengan cara penyampaian ganti dengan menyerahkan sesalinan Writ Saman dan Penyataan Tuntutan yang kedua-duanya bertarikh 31 Julai 2026 dan Perintah Penyampaian Ganti bertarikh 10 September 2026 ini secara penampalan di Papan Notis Mahkamah Majistret Kuala Lumpur dan secara pos berdaftar di alamat terakhir Defendan Kedua di 3-10-3, Seri Desa Condo, Jalan 1/116B, Off Kuchai Lama, 58200 Kuala Lumpur dan/atau No. 9, Jalan Pimping, Ukay Heights, 68000 Ampang, Selangor dan Defendan Ketiga di No. 9, Jalan Pimping, Ukay Heights, 68000 Ampang, Selangor dan dengan mengiklankan satu Notis sekali di dalam akhbar Bahasa Melayu “Berita Harian”. Penampalan dan pengiklanan tersebut hendaklah dianggap penyampaian sempurna dan cukup ke atas Defendan Kedua dan Defendan Ketiga tujuh (7) hari selepas tarikh akhir penampalan atau pengiklanan tersebut.

Writ Saman ini boleh diperiksa oleh kamu atas permohonan kamu di Mahkamah ini.

Bertarikh pada 10 September 2026
…………t.t………………..
Penolong Pendaftar
Mahkamah Majistret Kuala Lumpur

Notis Iklan ini telah difailkan oleh Tetuan Ainul Azam & Co, peguamcara bagi pihak Plaintif yang mempunyai alamat untuk penyampaian di Suite 6.01C, 6th Floor, South Block, The Ampwalk, 218, Jalan Ampang, 50450 Kuala Lumpur.
[Tel: 03-2171 1484, Faks: 03-2171 2484]
(Ruj Kami : AA/LITI/KWSP/004916/PUNCAK JAYA/2026)
(Ruj KWSP: 09901/6071-04(L)/STP/2026/0114)`,
    footerTag: '§ DOKUMEN MAHKAMAH & NOTIS AWAM',
    pageNumber: 'PAGE 1',
    columns: 1,
    gutter: 4.0,
    fontSize: 8.5,
    lineHeight: 11.2,
    preferredWidthMm: 63,
    preferredHeightMm: 150
  },
  {
    id: 'notis-kebankrapan',
    name: 'Notis Kebankrapan (Akta Insolvensi)',
    category: 'Kebankrapan',
    kicker: 'DALAM MAHKAMAH TINGGI MALAYA DI KUALA LUMPUR\nDALAM KEBANKRAPAN NO: WA-29NCC-4912-08/2026',
    edition: 'MAHKAMAH TINGGI MALAYA · BAHAGIAN KEBANKRAPAN',
    subCategory: 'NOTIS NO: 4912/2026',
    title: 'NOTIS KEBANKRAPAN',
    subHeader: 'Kepada: KAMARUL ARIFFIN BIN ZULKIFLI (NO. K/P: 820415-14-5591)',
    bodyText: `ANTARA
MAYBANK ISLAMIC BERHAD …PEMINJAM PENGHAKIMAN
DAN
KAMARUL ARIFFIN BIN ZULKIFLI …PENGHUTANG PENGHAKIMAN

AMBIL PERHATIAN bahawa dalam tempoh tujuh (7) hari selepas penyampaian Notis ini kepada kamu, tidak termasuk hari penyampaian, kamu hendaklah membayar kepada Peminjam Penghakiman sejumlah RM 148,920.45 yang dituntut oleh Peminjam Penghakiman sebagai jumlah baki yang kena dibayar di bawah Penghakiman Ingkar bertarikh 15 Jun 2026.

ATAU kamu hendaklah memuaskan Mahkamah bahawa kamu mempunyai suatu tuntutan balas, tolakan atau tuntutan silang yang bersamaan atau melebihi jumlah yang dituntut oleh Peminjam Penghakiman tersebut.

Kegagalan mematuhi kehendak Notis ini dalam tempoh yang ditetapkan akan mengakibatkan kamu melakukan suatu perbuatan kebankrapan di mana prosiding kebankrapan boleh diambil terhadap kamu.

Bertarikh pada 22 September 2026
…………t.t………………..
Timbalan Pendaftar
Mahkamah Tinggi Malaya, Kuala Lumpur

Notis ini dikeluarkan oleh Tetuan Zaid Ibrahim & Co, Peguamcara bagi Pemiutang Penghakiman.`,
    footerTag: '§ JABATAN INSOLVENSI MALAYSIA',
    pageNumber: 'PAGE K-12',
    columns: 1,
    gutter: 4.0,
    fontSize: 8.5,
    lineHeight: 11.2,
    preferredWidthMm: 63,
    preferredHeightMm: 100
  },
  {
    id: 'proklamasi-lelongan',
    name: 'Proklamasi Jualan Lelongan Awam (Hartanah)',
    category: 'Lelongan Awam',
    kicker: 'MAHKAMAH TINGGI MALAYA DI SHAH ALAM\nPERLELONGAN AWAM HARTANAH BERCAGAR',
    edition: 'PERLELONGAN AWAM · SEKSYEN GANTI RUGI',
    subCategory: 'NO. PERMOHONAN: BA-38-1099-09/2026',
    title: 'PROKLAMASI JUALAN',
    subHeader: 'MENURUT PERINTAH MAHKAMAH TINGGI MALAYA BERTARIKH 04 OGOS 2026',
    bodyText: `AKAN MENJUAL SECARA LELONGAN AWAM PADA:
HARI RABU, 28 OKTOBER 2026 JAM 11:00 PAGI
DI BILIK LELONGAN MAHKAMAH TINGGI SHAH ALAM

PERIHAL HARTANAH:
Sebuah unit Kondominium pegangan bebas beralamat No. B-18-04, Residensi Horizon, Jalan Pengaturcara U1/51A, Seksyen U1, 40150 Shah Alam, Selangor.
Keluasan Lantai: Kira-kira 110 meter persegi (1,184 kaki persegi).

HARGA RIZAB: RM 480,000.00 (RINGGIT MALAYSIA: EMPAT RATUS LAPAN PULUH RIBU SAHAJA)

Semua pembida yang berminat dikehendaki mendepositkan 10% daripada harga rizab dalam bentuk Draf Bank atas nama RHB BANK BERHAD sebelum jam 10:30 pagi pada hari lelongan.

Untuk butiran lanjut, sila hubungi Pelelong Berlesen:
EHSAN AUCTIONEERS SDN BHD (Tel: 03-2161 6649 / 012-308 9123).`,
    footerTag: '§ PROKLAMASI MAHKAMAH TINGGI',
    pageNumber: 'PAGE L-88',
    columns: 1,
    gutter: 4.0,
    fontSize: 8.5,
    lineHeight: 11.2,
    preferredWidthMm: 63,
    preferredHeightMm: 100
  },
  {
    id: 'notis-winding-up',
    name: 'Notis Penggulungan Syarikat (Winding-Up)',
    category: 'Penggulungan Syarikat',
    kicker: 'DALAM MAHKAMAH TINGGI MALAYA DI KUALA LUMPUR\n(BAHAGIAN DAGANG / INSOLVENSI KORPORAT)',
    edition: 'AKTA SYARIKAT 2016 · SEKSYEN 465(1)(e)',
    subCategory: 'PETISYEN PENGGULUNGAN NO: WA-28NCC-881-08/2026',
    title: 'NOTIS PETISYEN PENGGULUNGAN',
    subHeader: 'DALAM PERKARA MEGAH VENTURES SDN. BHD. (NO. PENDAFTARAN: 201501029381)',
    bodyText: `NOTIS ADALAH DENGAN INI DIBERIKAN bahawa satu Petisyen bagi Penggulungan Syarikat yang dinamakan di atas oleh Mahkamah Tinggi telah dikemukakan pada 18 Ogos 2026 oleh CIMB BANK BERHAD selaku Pemiutang.

Dan bahawa Petisyen tersebut telah diarahkan untuk didengar di hadapan Mahkamah Tinggi Kuala Lumpur pada hari Khamis, 12 November 2026 pada jam 9:00 pagi.

Mana-mana pemiutang atau penyumbang syarikat yang berhasrat menyokong atau menentang pembuatan suatu Perintah Penggulungan boleh hadir pada masa pendengaran tersebut.

Salinan Petisyen akan dibekalkan oleh peguamcara yang bertindak kepada pemohon apabila bayaran ditetapkan dibuat.

Tetuan Raja, Darryl & Loh, Peguamcara bagi Pempetisyen.`,
    footerTag: '§ AKTA SYARIKAT 2016',
    pageNumber: 'PAGE W-03',
    columns: 1,
    gutter: 4.0,
    fontSize: 8.5,
    lineHeight: 11.2,
    preferredWidthMm: 63,
    preferredHeightMm: 100
  },
  {
    id: 'tender-jkr-g7',
    name: 'Notis Iklan Tender Rasmi JKR (G7 CIDB)',
    category: 'Tender Kerajaan',
    kicker: 'KEMENTERIAN KERJA RAYA MALAYSIA\nJABATAN KERJA RAYA (JKR) MALAYSIA',
    edition: 'KENYATAAN TENDER TERBUKA KEBANGSAAN',
    subCategory: 'TENDER NO: JKR/IP/CKB/34/2026',
    title: 'KENYATAAN TENDER',
    subHeader: 'KOD BIDANG CIDB G7: PENGKHUSUSAN CE01 & CE21',
    bodyText: `Tender adalah dipelawa kepada Kontraktor Tempatan yang berdaftar dengan Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB) dalam Gred G7 Kategori CE (Pembinaan Kejuruteraan Awam) yang masih sah bagi menyertai tender berikut:

PROJEK: CADANGAN NAIKTARAF JALAN PERSEKUTUAN LALUAN 54 DARI KUALA SELANGOR KE IJOK, SELANGOR DARUL EHSAN.

Tarikh Dokumen Dijual: 05 Oktober 2026 hingga 26 Oktober 2026
Harga Dokumen Tender: RM 2,000.00 (Secara Draf Bank)
Tarikh Tutup Tender: 10 November 2026 (Selasa) sebelum jam 12:00 tengah hari di Peti Tender Cawangan Kontrak & Ukur Bahan, Ibu Pejabat JKR, Jalan Sultan Salahuddin, 50480 Kuala Lumpur.

Lawatan tapak adalah DIWAJIBKAN pada 08 Oktober 2026 jam 10:00 pagi.`,
    footerTag: '§ WARTA TENDER PERSEKUTUAN',
    pageNumber: 'PAGE T-09',
    columns: 1,
    gutter: 4.0,
    fontSize: 8.5,
    lineHeight: 11.2,
    preferredWidthMm: 63,
    preferredHeightMm: 100
  }
];

export const INITIAL_TRAFFIC_JOBS = [
  {
    id: 'JOB-901',
    jobCode: 'BH-26-4401',
    title: 'Notis Iklan: KWSP vs Puncak Jaya Petroleum & Ors',
    publication: 'BH' as const,
    category: 'Legal Notice' as const,
    assignedTo: 'Alex Chen',
    status: 'IN_PROGRESS' as const,
    receivedTime: '08:15 UTC',
    deadline: '16:00 UTC',
    pagePlacement: 'Iklan Mahkamah Page 14',
    priority: 'HIGH' as const,
    lastSyncedAt: '14:28:42 UTC',
    syncStatus: 'SYNCED' as const
  },
  {
    id: 'JOB-902',
    jobCode: 'NST-26-2180',
    title: 'Tender: CIDB G7 JKR Laluan 54 Selangor',
    publication: 'NST' as const,
    category: 'Tender Ad' as const,
    assignedTo: 'Sarah Jenkins',
    status: 'PROOFING' as const,
    receivedTime: '09:30 UTC',
    deadline: '17:30 UTC',
    pagePlacement: 'Business Section Page 8',
    priority: 'CRITICAL' as const,
    lastSyncedAt: '14:25:10 UTC',
    syncStatus: 'SYNCED' as const
  },
  {
    id: 'JOB-903',
    jobCode: 'HM-26-1094',
    title: 'Proklamasi Jualan: Residensi Horizon Shah Alam',
    publication: 'HM' as const,
    category: 'Proclamation' as const,
    assignedTo: 'Marcus Vance',
    status: 'APPROVED' as const,
    receivedTime: '10:00 UTC',
    deadline: '18:00 UTC',
    pagePlacement: 'Notis Awam Page 22',
    priority: 'NORMAL' as const,
    lastSyncedAt: '14:20:05 UTC',
    syncStatus: 'SYNCED' as const
  }
];
