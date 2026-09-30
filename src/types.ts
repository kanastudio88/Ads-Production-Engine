export interface TeamMember {
  id: string;
  seatNumber: string; // '01' - '08'
  name: string;
  email: string;
  role: string;
  desk: string;
  avatarColor: string;
  isOnline: boolean;
  lastActive: string;
}

export interface MemberJobMetrics {
  userId: string;
  name: string;
  role: string;
  desk: string;
  totalReceived: number;
  nstCurrent: number;
  nstAdvanced: number;
  bhCurrent: number;
  bhAdvanced: number;
  hmCurrent: number;
  hmAdvanced: number;
}

export interface DailyArchiveRecord {
  id: string;
  date: string;
  timestamp: number;
  totalReceived: number;
  currentJobs: number;
  advancedJobs: number;
  activeDesks: number;
  metrics: MemberJobMetrics[];
  archivedBy: string;
}

export type ToolType = 'select' | 'direct' | 'type' | 'frame' | 'hand' | 'zoom';

export type NewspaperGridMode = 'none' | 'broadsheet' | 'tabloid';
export type ViewportMode = 'normal' | 'preview' | 'newsprint' | 'print_preview';
export type NUpMode = 1 | 2 | 4;

export interface PreflightIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  canAutoFix?: boolean;
}

export interface DocSnapshot {
  id: string;
  timestamp: number;
  title: string;
  doc: LayoutDocument;
  actionNote: string;
}

export interface AdFormatPreset {
  id: string;
  name: string;
  code: string;
  widthMm: number;
  heightMm: number;
  columns: number;
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'oxford' | 'none';
  fontSize: number;
  lineHeight: number;
  description: string;
}

export interface LayoutDocument {
  kicker: string;
  edition: string;
  subCategory: string;
  title: string;
  subHeader: string;
  bodyText: string;
  columns: number;
  gutter: number; // mm
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '600' | 'italic';
  fontSize: number; // pt
  lineHeight: number; // pt
  tracking: number; // 1/1000 em
  alignment: 'left' | 'center' | 'right' | 'justify' | 'justify-all';
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textColor?: string;
  textHighlight?: string;
  firstLineIndentMm?: number;
  paragraphSpacingMm?: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'oxford' | 'none';
  borderWidth: number; // pt (0, 0.25, 0.5, 0.75, 1, 1.5, 2, etc.)
  frameWidth: number; // mm
  frameHeight: number; // mm
  posX: number; // mm
  posY: number; // mm
  dropCap: boolean;
  balanceSubColumns: boolean;
  autoScaleFont: boolean;
  opticalMarginAlignment: boolean;
  snapBaselineGrid: boolean;
  footerTag: string;
  pageNumber: string;
  bleedMm: number;
  showRulers: boolean;
  showGuides: boolean;
  showBaselineGrid: boolean;
  zoom: number; // percentage e.g. 50, 75, 100, 125, 150, 200
  panX?: number;
  panY?: number;
  newspaperGrid: NewspaperGridMode;
  viewportMode: ViewportMode;
  nUpMode: NUpMode;
  lockedBySeat?: string; // e.g. 'Alex Chen (DESK 01)'
  themeMode?: 'light' | 'dark';
  watermarkText?: string;
  publicationName?: 'NST' | 'BH' | 'HM' | 'THE STAR' | 'UTUSAN';
}

export interface TrafficJob {
  id: string;
  jobCode: string;
  title: string;
  publication: 'NST' | 'BH' | 'HM';
  category: 'Legal Notice' | 'Tender Ad' | 'Proclamation' | 'Financial' | 'Display';
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PROOFING' | 'APPROVED' | 'RELEASED';
  receivedTime: string;
  deadline: string;
  pagePlacement: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  lastSyncedAt?: string;
  syncStatus?: 'SYNCED' | 'PENDING_PUSH' | 'OFFLINE';
}

export interface TeamChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderSeat: string;
  avatarColor: string;
  message: string;
  timestamp: string;
  channel: string;
  jobTag?: string;
  attachmentType?: 'layout_proof' | 'urgent_alert' | 'text_sample';
  attachmentData?: string;
}

