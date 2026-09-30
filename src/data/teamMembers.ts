import { TeamMember, MemberJobMetrics } from '../types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-01',
    seatNumber: '01',
    name: 'Alex Chen',
    email: 'alex@studio8.io',
    role: 'Team Lead',
    desk: 'DESK 01',
    avatarColor: 'bg-primary text-on-primary',
    isOnline: true,
    lastActive: 'Active now'
  },
  {
    id: 'user-02',
    seatNumber: '02',
    name: 'Sarah Jenkins',
    email: 'sarah@studio8.io',
    role: 'Senior Designer',
    desk: 'DESK 02',
    avatarColor: 'bg-indigo-600 text-white',
    isOnline: true,
    lastActive: 'Active now'
  },
  {
    id: 'user-03',
    seatNumber: '03',
    name: 'Marcus Vance',
    email: 'marcus@studio8.io',
    role: 'Typesetter',
    desk: 'DESK 03',
    avatarColor: 'bg-slate-700 text-white',
    isOnline: true,
    lastActive: 'Active now'
  },
  {
    id: 'user-04',
    seatNumber: '04',
    name: 'Elena Rostova',
    email: 'elena@studio8.io',
    role: 'Production Artist',
    desk: 'DESK 04',
    avatarColor: 'bg-emerald-600 text-white',
    isOnline: true,
    lastActive: 'Active now'
  },
  {
    id: 'user-05',
    seatNumber: '05',
    name: 'David Kim',
    email: 'david@studio8.io',
    role: 'Production Artist',
    desk: 'DESK 05',
    avatarColor: 'bg-teal-700 text-white',
    isOnline: true,
    lastActive: 'Active now'
  },
  {
    id: 'user-06',
    seatNumber: '06',
    name: 'Priya Sharma',
    email: 'priya@studio8.io',
    role: 'Junior Designer',
    desk: 'DESK 06',
    avatarColor: 'bg-purple-700 text-white',
    isOnline: false,
    lastActive: '24m ago'
  },
  {
    id: 'user-07',
    seatNumber: '07',
    name: 'Jordan Taylor',
    email: 'jordan@studio8.io',
    role: 'Layout Specialist',
    desk: 'DESK 07',
    avatarColor: 'bg-amber-700 text-white',
    isOnline: false,
    lastActive: '1h ago'
  },
  {
    id: 'user-08',
    seatNumber: '08',
    name: 'Sam Rivera',
    email: 'sam@studio8.io',
    role: 'Prepress Tech',
    desk: 'DESK 08',
    avatarColor: 'bg-cyan-700 text-white',
    isOnline: false,
    lastActive: '3h ago'
  }
];

export const INITIAL_JOB_METRICS: MemberJobMetrics[] = [
  {
    userId: 'user-01',
    name: 'Alex Chen',
    role: 'TEAM LEAD',
    desk: 'DESK 01',
    totalReceived: 12,
    nstCurrent: 5,
    nstAdvanced: 2,
    bhCurrent: 3,
    bhAdvanced: 1,
    hmCurrent: 1,
    hmAdvanced: 0
  },
  {
    userId: 'user-02',
    name: 'Sarah Jenkins',
    role: 'SENIOR DESIGNER',
    desk: 'DESK 02',
    totalReceived: 10,
    nstCurrent: 2,
    nstAdvanced: 1,
    bhCurrent: 4,
    bhAdvanced: 1,
    hmCurrent: 2,
    hmAdvanced: 0
  },
  {
    userId: 'user-03',
    name: 'Marcus Vance',
    role: 'TYPESETTER',
    desk: 'DESK 03',
    totalReceived: 9,
    nstCurrent: 3,
    nstAdvanced: 1,
    bhCurrent: 2,
    bhAdvanced: 1,
    hmCurrent: 1,
    hmAdvanced: 1
  },
  {
    userId: 'user-04',
    name: 'Elena Rostova',
    role: 'PRODUCTION ARTIST',
    desk: 'DESK 04',
    totalReceived: 11,
    nstCurrent: 4,
    nstAdvanced: 2,
    bhCurrent: 3,
    bhAdvanced: 0,
    hmCurrent: 2,
    hmAdvanced: 0
  },
  {
    userId: 'user-05',
    name: 'David Kim',
    role: 'PRODUCTION ARTIST',
    desk: 'DESK 05',
    totalReceived: 8,
    nstCurrent: 2,
    nstAdvanced: 1,
    bhCurrent: 2,
    bhAdvanced: 1,
    hmCurrent: 1,
    hmAdvanced: 1
  },
  {
    userId: 'user-06',
    name: 'Priya Sharma',
    role: 'JUNIOR DESIGNER',
    desk: 'DESK 06',
    totalReceived: 7,
    nstCurrent: 2,
    nstAdvanced: 1,
    bhCurrent: 1,
    bhAdvanced: 1,
    hmCurrent: 2,
    hmAdvanced: 0
  },
  {
    userId: 'user-07',
    name: 'Jordan Taylor',
    role: 'LAYOUT SPECIALIST',
    desk: 'DESK 07',
    totalReceived: 6,
    nstCurrent: 2,
    nstAdvanced: 1,
    bhCurrent: 1,
    bhAdvanced: 0,
    hmCurrent: 1,
    hmAdvanced: 1
  },
  {
    userId: 'user-08',
    name: 'Sam Rivera',
    role: 'PREPRESS TECH',
    desk: 'DESK 08',
    totalReceived: 5,
    nstCurrent: 1,
    nstAdvanced: 1,
    bhCurrent: 1,
    bhAdvanced: 1,
    hmCurrent: 1,
    hmAdvanced: 0
  }
];
