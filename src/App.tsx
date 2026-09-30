import React, { useState, useEffect } from 'react';
import {
  TeamMember,
  MemberJobMetrics,
  DailyArchiveRecord,
  LayoutDocument,
  TrafficJob
} from './types';
import { INITIAL_TEAM_MEMBERS, INITIAL_JOB_METRICS } from './data/teamMembers';
import { SAMPLE_COPIES, INITIAL_TRAFFIC_JOBS } from './data/sampleCopies';
import { LoginPage } from './components/LoginModalOrPage';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { WorkspaceView } from './components/Workspace/WorkspaceView';
import { DailySummaryPage } from './components/DailySummary/DailySummaryPage';
import { TrafficControllerModal } from './components/TrafficController/TrafficControllerModal';
import { TeamChatView } from './components/TeamChat/TeamChatView';

const DEFAULT_DOC: LayoutDocument = {
  kicker: 'DALAM MAHKAMAH MAJISTRET DI KUALA LUMPUR\nDALAM WILAYAH PERSEKUTUAN KUALA LUMPUR, MALAYSIA\nGUAMAN SIVIL NO: WA-A72NCvC-3158-07/2026',
  edition: 'MAHKAMAH MAJISTRET KUALA LUMPUR · BAHAGIAN SIVIL',
  subCategory: 'GUAMAN NO: WA-A72NCvC-3158-07/2026',
  title: 'NOTIS IKLAN',
  subHeader: '(Dalam perkara mengenai Writ Saman bertarikh 31 Julai 2026)',
  bodyText: SAMPLE_COPIES[0].bodyText,
  columns: 1,
  gutter: 0.05, // 0.05mm standard gutter between text boxes
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  fontSize: 5.2, // standard 5.2pt
  lineHeight: 6.5,
  tracking: 0,
  alignment: 'justify',
  borderStyle: 'solid',
  borderWidth: 0.5,
  frameWidth: 63.0,
  frameHeight: 150.0,
  posX: 73.5,
  posY: 24.5,
  dropCap: false,
  balanceSubColumns: true,
  autoScaleFont: true,
  opticalMarginAlignment: true,
  snapBaselineGrid: true,
  footerTag: '§ DOKUMEN MAHKAMAH & NOTIS AWAM',
  pageNumber: 'PAGE 1',
  bleedMm: 3.0,
  showRulers: true,
  showGuides: true,
  showBaselineGrid: true,
  zoom: 100,
  newspaperGrid: 'none',
  viewportMode: 'normal',
  nUpMode: 1
};

export default function App() {
  // Session & Auth state (restricted to the 8 authorized seats)
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('workspace');
  
  // Team Presence State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('st8_team_members');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Daily Job Metrics Tracker State
  const [jobMetrics, setJobMetrics] = useState<MemberJobMetrics[]>(() => {
    const saved = localStorage.getItem('st8_job_metrics');
    return saved ? JSON.parse(saved) : INITIAL_JOB_METRICS;
  });

  // Shift Archives State
  const [archives, setArchives] = useState<DailyArchiveRecord[]>(() => {
    const saved = localStorage.getItem('st8_archives');
    return saved ? JSON.parse(saved) : [];
  });

  // Traffic Controller State
  const [trafficSheetUrl, setTrafficSheetUrl] = useState<string>(() => {
    return (
      localStorage.getItem('st8_traffic_sheet_url') ||
      'https://docs.google.com/spreadsheets/d/1Production-Hub-Job-Traffic-Control-2026/edit'
    );
  });
  const [trafficJobs, setTrafficJobs] = useState<TrafficJob[]>(() => {
    const saved = localStorage.getItem('st8_traffic_jobs');
    return saved ? JSON.parse(saved) : INITIAL_TRAFFIC_JOBS;
  });
  const [isTrafficModalOpen, setIsTrafficModalOpen] = useState(false);

  // Active Layout Document State
  const [documentState, setDocumentState] = useState<LayoutDocument>(() => {
    const saved = localStorage.getItem('st8_current_doc');
    return saved ? JSON.parse(saved) : DEFAULT_DOC;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('st8_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('st8_job_metrics', JSON.stringify(jobMetrics));
  }, [jobMetrics]);

  useEffect(() => {
    localStorage.setItem('st8_archives', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('st8_traffic_jobs', JSON.stringify(trafficJobs));
  }, [trafficJobs]);

  useEffect(() => {
    localStorage.setItem('st8_traffic_sheet_url', trafficSheetUrl);
  }, [trafficSheetUrl]);

  useEffect(() => {
    localStorage.setItem('st8_current_doc', JSON.stringify(documentState));
  }, [documentState]);

  // Toggle user online/offline status
  const handleToggleUserOnline = (userId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === userId
          ? {
              ...member,
              isOnline: !member.isOnline,
              lastActive: !member.isOnline ? 'Active now' : 'Just now'
            }
          : member
      )
    );
  };

  // Switch logged in active user
  const handleSwitchUser = (user: TeamMember) => {
    setCurrentUser(user);
    // Ensure the switched user is online
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === user.id ? { ...m, isOnline: true } : m))
    );
  };

  // Lock session / Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Update layout document
  const handleUpdateDocument = (updated: Partial<LayoutDocument>) => {
    setDocumentState((prev) => ({ ...prev, ...updated }));
  };

  // Increment summary jobs from traffic dispatcher
  const handleIncrementSummaryJob = (
    userId: string,
    publication: 'NST' | 'BH' | 'HM',
    isAdvanced: boolean
  ) => {
    setJobMetrics((prev) =>
      prev.map((m) => {
        if (m.userId !== userId) return m;
        const field =
          publication === 'NST'
            ? isAdvanced
              ? 'nstAdvanced'
              : 'nstCurrent'
            : publication === 'BH'
            ? isAdvanced
              ? 'bhAdvanced'
              : 'bhCurrent'
            : isAdvanced
            ? 'hmAdvanced'
            : 'hmCurrent';

        const updated = { ...m, [field]: m[field] + 1 };
        updated.totalReceived =
          updated.nstCurrent +
          updated.nstAdvanced +
          updated.bhCurrent +
          updated.bhAdvanced +
          updated.hmCurrent +
          updated.hmAdvanced;
        return updated;
      })
    );
  };

  // Daily Archive and Reset
  const handleArchiveAndReset = () => {
    const totalReceivedSum = jobMetrics.reduce((acc, m) => acc + m.totalReceived, 0);
    const nstCurrentSum = jobMetrics.reduce((acc, m) => acc + m.nstCurrent, 0);
    const nstAdvancedSum = jobMetrics.reduce((acc, m) => acc + m.nstAdvanced, 0);
    const bhCurrentSum = jobMetrics.reduce((acc, m) => acc + m.bhCurrent, 0);
    const bhAdvancedSum = jobMetrics.reduce((acc, m) => acc + m.bhAdvanced, 0);
    const hmCurrentSum = jobMetrics.reduce((acc, m) => acc + m.hmCurrent, 0);
    const hmAdvancedSum = jobMetrics.reduce((acc, m) => acc + m.hmAdvanced, 0);

    const totalCurrent = nstCurrentSum + bhCurrentSum + hmCurrentSum;
    const totalAdvanced = nstAdvancedSum + bhAdvancedSum + hmAdvancedSum;

    const newArchiveRecord: DailyArchiveRecord = {
      id: `arch-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      timestamp: Date.now(),
      totalReceived: totalReceivedSum,
      currentJobs: totalCurrent,
      advancedJobs: totalAdvanced,
      activeDesks: teamMembers.filter((m) => m.isOnline).length,
      metrics: JSON.parse(JSON.stringify(jobMetrics)),
      archivedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Auto-Cycle'
    };

    setArchives((prev) => [newArchiveRecord, ...prev]);

    // Reset all member counts to 0
    setJobMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        totalReceived: 0,
        nstCurrent: 0,
        nstAdvanced: 0,
        bhCurrent: 0,
        bhAdvanced: 0,
        hmCurrent: 0,
        hmAdvanced: 0
      }))
    );
  };

  // Traffic job dispatch helpers
  const handleAddTrafficJob = (job: Omit<TrafficJob, 'id'>) => {
    const newJob: TrafficJob = {
      ...job,
      id: `JOB-${Date.now()}`
    };
    setTrafficJobs((prev) => [newJob, ...prev]);
  };

  const handleUpdateTrafficJobStatus = (jobId: string, status: TrafficJob['status']) => {
    setTrafficJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  // If user is not authenticated, show Page 1: Google SSO Login Screen
  if (!currentUser) {
    return (
      <LoginPage
        teamMembers={teamMembers}
        onSelectUser={handleSwitchUser}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fbf8ff] text-slate-900 font-sans">
      {/* Top Header with live UTC time and 8-seat presence strip */}
      <Header
        currentUser={currentUser}
        teamMembers={teamMembers}
        onToggleUserOnline={handleToggleUserOnline}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        currentModuleName={
          activeTab === 'workspace'
            ? 'Workspace CS5.5'
            : activeTab === 'dailySummary'
            ? 'Daily Summary'
            : 'Traffic Controller'
        }
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Left Navigation with exactly 3 options */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenTrafficController={() => setIsTrafficModalOpen(true)}
          trafficSheetUrl={trafficSheetUrl}
        />

        {/* Dynamic Center View */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          {activeTab === 'workspace' && (
            <WorkspaceView
              doc={documentState}
              onUpdateDoc={handleUpdateDocument}
            />
          )}

          {activeTab === 'dailySummary' && (
            <DailySummaryPage
              metrics={jobMetrics}
              teamMembers={teamMembers}
              onUpdateMetrics={setJobMetrics}
              archives={archives}
              onArchiveAndReset={handleArchiveAndReset}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'teamChat' && (
            <TeamChatView
              currentUser={currentUser}
              teamMembers={teamMembers}
              currentDoc={documentState}
            />
          )}
        </main>
      </div>

      {/* Traffic Controller Google Sheet Modal */}
      <TrafficControllerModal
        isOpen={isTrafficModalOpen}
        onClose={() => setIsTrafficModalOpen(false)}
        trafficSheetUrl={trafficSheetUrl}
        onUpdateSheetUrl={setTrafficSheetUrl}
        trafficJobs={trafficJobs}
        teamMembers={teamMembers}
        onAddJob={handleAddTrafficJob}
        onUpdateJobStatus={handleUpdateTrafficJobStatus}
        onIncrementSummaryJob={handleIncrementSummaryJob}
      />
    </div>
  );
}
