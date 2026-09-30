import { TeamChatMessage } from '../types';

export const INITIAL_CHAT_MESSAGES: TeamChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'seat-02',
    senderName: 'Sarah Jenkins',
    senderRole: 'Senior Typesetter',
    senderSeat: '02',
    avatarColor: 'bg-emerald-600',
    message: 'Salam team, I have queued the BH Court Notice for KWSP (WA-A72NCvC). Applying 5pt standard body and 6pt header formatting.',
    timestamp: '08:45 AM',
    channel: '#production-floor',
    jobTag: 'WA-A72NCvC'
  },
  {
    id: 'msg-2',
    senderId: 'seat-01',
    senderName: 'Alex Chen',
    senderRole: 'Lead Prepress Operator',
    senderSeat: '01',
    avatarColor: 'bg-blue-600',
    message: 'Noted Sarah! Auto-Fit engine calibrated to 0.5mm gutter and 0.5cm padding. Zero overset verified on 10x2 box.',
    timestamp: '08:48 AM',
    channel: '#production-floor',
    jobTag: '10x2 · 0.5pt Border'
  },
  {
    id: 'msg-3',
    senderId: 'seat-04',
    senderName: 'David Tan',
    senderRole: 'Quality Controller',
    senderSeat: '04',
    avatarColor: 'bg-amber-600',
    message: 'Pre-flight check passed for NST and Berita Harian editions. All court numbers are verified against official gazette.',
    timestamp: '09:05 AM',
    channel: '#production-floor'
  },
  {
    id: 'msg-4',
    senderId: 'seat-03',
    senderName: 'Priya Nair',
    senderRole: 'Ad Layout Specialist',
    senderSeat: '03',
    avatarColor: 'bg-purple-600',
    message: 'Need quick sign-off on 15x2 Winding Up notice before 11:30 AM press cutoff.',
    timestamp: '09:15 AM',
    channel: '#urgent-proofs',
    jobTag: '15x2 Winding Up',
    attachmentType: 'urgent_alert'
  }
];
