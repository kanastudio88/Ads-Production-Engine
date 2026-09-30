import React, { useState } from 'react';
import { TrafficJob, TeamMember } from '../../types';

interface TrafficControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trafficSheetUrl: string;
  onUpdateSheetUrl: (newUrl: string) => void;
  trafficJobs: TrafficJob[];
  teamMembers: TeamMember[];
  onAddJob: (job: Omit<TrafficJob, 'id'>) => void;
  onUpdateJobStatus: (jobId: string, status: TrafficJob['status']) => void;
  onIncrementSummaryJob?: (userId: string, publication: 'NST' | 'BH' | 'HM', isAdvanced: boolean) => void;
}

export const TrafficControllerModal: React.FC<TrafficControllerModalProps> = ({
  isOpen,
  onClose,
  trafficSheetUrl,
  onUpdateSheetUrl,
  trafficJobs,
  teamMembers,
  onAddJob,
  onUpdateJobStatus,
  onIncrementSummaryJob
}) => {
  const [sheetUrlInput, setSheetUrlInput] = useState(trafficSheetUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [activePubFilter, setActivePubFilter] = useState<'ALL' | 'NST' | 'BH' | 'HM'>('ALL');
  
  // New Job form state
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobPub, setJobPub] = useState<'NST' | 'BH' | 'HM'>('NST');
  const [jobCategory, setJobCategory] = useState<TrafficJob['category']>('Legal Notice');
  const [assignedMember, setAssignedMember] = useState(teamMembers[0]?.name || 'Alex Chen');
  const [jobPlacement, setJobPlacement] = useState('Classifieds Page 12');
  const [jobPriority, setJobPriority] = useState<TrafficJob['priority']>('NORMAL');
  const [isAdvancedJob, setIsAdvancedJob] = useState(false);

  if (!isOpen) return null;

  const handleOpenGoogleSheet = () => {
    window.open(trafficSheetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveUrl = () => {
    onUpdateSheetUrl(sheetUrlInput);
    setIsEditingUrl(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    const randCode = `${jobPub}-26-${Math.floor(1000 + Math.random() * 9000)}`;

    onAddJob({
      jobCode: randCode,
      title: jobTitle.trim(),
      publication: jobPub,
      category: jobCategory,
      assignedTo: assignedMember,
      status: 'IN_PROGRESS',
      receivedTime: timeStr,
      deadline: '18:00 UTC',
      pagePlacement: jobPlacement,
      priority: jobPriority
    });

    // Also update daily summary if requested
    const member = teamMembers.find((m) => m.name === assignedMember);
    if (member && onIncrementSummaryJob) {
      onIncrementSummaryJob(member.id, jobPub, isAdvancedJob);
    }

    setJobTitle('');
    setShowNewJobModal(false);
  };

  const filteredJobs = trafficJobs.filter((job) => {
    if (activePubFilter === 'ALL') return true;
    return job.publication === activePubFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">table_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Traffic Controller</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  LIVE GOOGLE SHEETS DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct integration with external Google Sheet for newspaper publication pipeline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenGoogleSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Open External Google Sheet</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Google Sheet URL Config Strip */}
        <div className="px-6 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[320px]">
            <span className="font-mono text-[11px] font-semibold text-slate-600 uppercase">SHEET TARGET:</span>
            {isEditingUrl ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-white border border-blue-400 rounded text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <button
                  onClick={handleSaveUrl}
                  className="px-2.5 py-1 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-900 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingUrl(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <code className="text-[11px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300 max-w-md truncate">
                  {trafficSheetUrl}
                </code>
                <button
                  onClick={() => setIsEditingUrl(true)}
                  className="text-[11px] text-blue-600 hover:underline font-mono cursor-pointer"
                >
                  Edit URL
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500">FILTER PUB:</span>
            {(['ALL', 'NST', 'BH', 'HM'] as const).map((pub) => (
              <button
                key={pub}
                onClick={() => setActivePubFilter(pub)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePubFilter === pub
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {pub}
              </button>
            ))}
            <button
              onClick={() => setShowNewJobModal(true)}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Dispatch Job</span>
            </button>
          </div>
        </div>

        {/* Content: Job Dispatch Queue Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">Job Code</th>
                  <th className="py-2.5 px-3">Publication & Type</th>
                  <th className="py-2.5 px-3">Title / Notice</th>
                  <th className="py-2.5 px-3">Assigned Desk</th>
                  <th className="py-2.5 px-3">Placement</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {job.jobCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                            job.publication === 'NST'
                              ? 'bg-blue-100 text-blue-800'
                              : job.publication === 'BH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {job.publication}
                        </span>
                        <span className="text-slate-500 font-medium text-[11px]">{job.category}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                      {job.title}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {job.assignedTo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {job.pagePlacement}
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateJobStatus(job.id, e.target.value as TrafficJob['status'])}
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer focus:outline-none ${
                          job.status === 'APPROVED' || job.status === 'RELEASED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : job.status === 'PROOFING'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : job.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="PROOFING">PROOFING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="RELEASED">RELEASED</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={handleOpenGoogleSheet}
                        className="text-blue-600 hover:text-blue-800 font-mono text-[11px] font-semibold hover:underline"
                      >
                        Sync Sheet ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>PIPELINE CAPACITY: 8 ACTIVE CONCURRENT NODES</span>
          <span>ESTIMATED DAILY THROUGHPUT: 120 PAGES</span>
        </div>
      </div>

      {/* Nested Dispatch New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Dispatch New Newspaper Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                  TITLE / LEGAL NOTICE HEADING
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Notice of Extraordinary General Meeting"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                    PUBLICATION
                  </label>
                  <select
                    value={jobPub}
                    onChange={(e) => setJobPub(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-semibold"
                  >
                    <option value="NST">NST (New Straits Times)</option>
                    <option value="BH">BH (Berita Harian)</option>
                    <option value="HM">HM (Harian Metro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  >
                    <option value="Legal Notice">Legal Notice</option>
                    <option value="Tender Ad">Tender Ad</option>
                    <option value="Proclamation">Proclamation</option>
                    <option value="Financial">Financial</option>
                    <option value="Display">Display</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                    ASSIGNED DESK
                  </label>
                  <select
                    value={assignedMember}
                    onChange={(e) => setAssignedMember(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.desk})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                    JOB TIER
                  </label>
                  <select
                    value={isAdvancedJob ? 'ADVANCED' : 'CURRENT'}
                    onChange={(e) => setIsAdvancedJob(e.target.value === 'ADVANCED')}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  >
                    <option value="CURRENT">Current Run</option>
                    <option value="ADVANCED">Advanced Run</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-1">
                  PAGE PLACEMENT
                </label>
                <input
                  type="text"
                  value={jobPlacement}
                  onChange={(e) => setJobPlacement(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
