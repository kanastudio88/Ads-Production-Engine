import React, { useState } from 'react';
import { MemberJobMetrics, TeamMember, DailyArchiveRecord } from '../../types';

interface DailySummaryPageProps {
  metrics: MemberJobMetrics[];
  teamMembers: TeamMember[];
  onUpdateMetrics: (updatedMetrics: MemberJobMetrics[]) => void;
  archives: DailyArchiveRecord[];
  onArchiveAndReset: () => void;
  currentUser: TeamMember;
}

export const DailySummaryPage: React.FC<DailySummaryPageProps> = ({
  metrics,
  teamMembers,
  onUpdateMetrics,
  archives,
  onArchiveAndReset,
  currentUser
}) => {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Computations
  const totalReceivedSum = metrics.reduce((acc, m) => acc + (m.totalReceived || 0), 0);
  const nstCurrentSum = metrics.reduce((acc, m) => acc + (m.nstCurrent || 0), 0);
  const nstAdvancedSum = metrics.reduce((acc, m) => acc + (m.nstAdvanced || 0), 0);
  const bhCurrentSum = metrics.reduce((acc, m) => acc + (m.bhCurrent || 0), 0);
  const bhAdvancedSum = metrics.reduce((acc, m) => acc + (m.bhAdvanced || 0), 0);
  const hmCurrentSum = metrics.reduce((acc, m) => acc + (m.hmCurrent || 0), 0);
  const hmAdvancedSum = metrics.reduce((acc, m) => acc + (m.hmAdvanced || 0), 0);

  const totalCurrent = nstCurrentSum + bhCurrentSum + hmCurrentSum;
  const totalAdvanced = nstAdvancedSum + bhAdvancedSum + hmAdvancedSum;
  const activeDesksCount = teamMembers.filter((m) => m.isOnline).length;

  const handleCellChange = (userId: string, field: keyof MemberJobMetrics, value: number) => {
    const val = Math.max(0, isNaN(value) ? 0 : value);
    const updated = metrics.map((item) => {
      if (item.userId !== userId) return item;
      const newItem = { ...item, [field]: val };
      if (field !== 'totalReceived') {
        // Auto calculate total received as sum of all publications
        newItem.totalReceived =
          newItem.nstCurrent +
          newItem.nstAdvanced +
          newItem.bhCurrent +
          newItem.bhAdvanced +
          newItem.hmCurrent +
          newItem.hmAdvanced;
      }
      return newItem;
    });
    onUpdateMetrics(updated);
  };

  const handleQuickAdjust = (userId: string, field: keyof MemberJobMetrics, delta: number) => {
    const target = metrics.find((m) => m.userId === userId);
    if (!target) return;
    const currentVal = (target[field] as number) || 0;
    handleCellChange(userId, field, currentVal + delta);
  };

  const handleConfirmArchive = () => {
    onArchiveAndReset();
    setShowArchiveModal(false);
  };

  const exportSummaryCsv = () => {
    const headers = [
      'Seat',
      'User Name',
      'Role',
      'Desk',
      'Total Received',
      'NST Current',
      'NST Advanced',
      'BH Current',
      'BH Advanced',
      'HM Current',
      'HM Advanced'
    ];

    const rows = metrics.map((m, idx) => [
      `0${idx + 1}`,
      `"${m.name}"`,
      `"${m.role}"`,
      `"${m.desk}"`,
      m.totalReceived,
      m.nstCurrent,
      m.nstAdvanced,
      m.bhCurrent,
      m.bhAdvanced,
      m.hmCurrent,
      m.hmAdvanced
    ]);

    const summaryRow = [
      'TOTAL',
      'AGGREGATE TOTAL (8 MEMBERS)',
      '',
      '',
      totalReceivedSum,
      nstCurrentSum,
      nstAdvancedSum,
      bhCurrentSum,
      bhAdvancedSum,
      hmCurrentSum,
      hmAdvancedSum
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(',')), summaryRow.join(',')].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Studio8_Daily_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-[#fbf8ff] flex flex-col h-full overflow-y-auto p-4 md:p-6 select-none font-sans">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* Top Title & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-2xl">bar_chart</span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Daily Job Performance Summary
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportSummaryCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-mono text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export CSV</span>
            </button>

            {archives.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-mono text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                <span>Archived Days ({archives.length})</span>
              </button>
            )}

            <button
              onClick={() => setShowArchiveModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-mono text-xs font-bold shadow-xs transition-colors cursor-pointer uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>DAILY RESET & ARCHIVE</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards matching Screenshot 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: TOTAL RECEIVED */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                TOTAL RECEIVED
              </span>
              <span className="material-symbols-outlined text-slate-400 text-sm">inventory_2</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-slate-900">{totalReceivedSum}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
                100% Volume
              </span>
            </div>
          </div>

          {/* Card 2: CURRENT JOB */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                CURRENT JOB
              </span>
              <span className="material-symbols-outlined text-blue-500 text-sm">description</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold font-mono text-blue-600">{totalCurrent}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Today's active runs (NST / BH / HM)
              </div>
            </div>
          </div>

          {/* Card 3: ADVANCED JOB */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                ADVANCED JOB
              </span>
              <span className="material-symbols-outlined text-indigo-400 text-sm">fast_forward</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-indigo-600">{totalAdvanced}</span>
              <span className="text-[10px] text-indigo-500 font-mono font-medium">Next-Day Prepress</span>
            </div>
          </div>

          {/* Card 4: DESK ASSIGNMENT */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                DESK ASSIGNMENT
              </span>
              <span className="material-symbols-outlined text-slate-400 text-sm">group</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-slate-900">
                <span className="text-emerald-600">{activeDesksCount}</span> / 8
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                Active Desks
              </span>
            </div>
          </div>
        </div>

        {/* Main Job Tracking Metrics Table matching Screenshot 9 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {/* Master Section Header */}
                <tr className="bg-slate-50/90 border-b border-slate-200 font-mono text-[11px] uppercase text-slate-500 tracking-wider">
                  <th className="py-2.5 px-4 font-semibold w-64">USER NAME & ROLE</th>
                  <th className="py-2.5 px-3 text-center font-semibold">TOTAL RECEIVED</th>
                  <th className="py-2.5 px-3 text-center font-semibold bg-blue-50/40 border-l border-r border-slate-200" colSpan={2}>
                    NST (NEW STRAITS TIMES)
                  </th>
                  <th className="py-2.5 px-3 text-center font-semibold bg-amber-50/30 border-r border-slate-200" colSpan={2}>
                    BH (BERITA HARIAN)
                  </th>
                  <th className="py-2.5 px-3 text-center font-semibold bg-emerald-50/30 border-r border-slate-200" colSpan={2}>
                    HM (HARIAN METRO)
                  </th>
                  <th className="py-2.5 px-3 text-center font-semibold">ADJUST</th>
                </tr>
                {/* Sub-tier Column Header */}
                <tr className="bg-slate-50/50 border-b border-slate-200 font-mono text-[10px] uppercase text-slate-400 font-medium">
                  <th className="py-1 px-4"></th>
                  <th className="py-1 px-3 text-center"></th>
                  <th className="py-1 px-3 text-center bg-blue-50/30 border-l border-slate-200">CURRENT</th>
                  <th className="py-1 px-3 text-center bg-blue-50/30 border-r border-slate-200">ADVANCED</th>
                  <th className="py-1 px-3 text-center bg-amber-50/20">CURRENT</th>
                  <th className="py-1 px-3 text-center bg-amber-50/20 border-r border-slate-200">ADVANCED</th>
                  <th className="py-1 px-3 text-center bg-emerald-50/20">CURRENT</th>
                  <th className="py-1 px-3 text-center bg-emerald-50/20 border-r border-slate-200">ADVANCED</th>
                  <th className="py-1 px-3 text-center">QUICK +/-</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {metrics.map((member, index) => {
                  const avatarColor =
                    index === 0
                      ? 'bg-blue-600 text-white'
                      : index === 1
                      ? 'bg-indigo-600 text-white'
                      : index === 2
                      ? 'bg-slate-700 text-white'
                      : index === 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700';

                  const initials = member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('');

                  return (
                    <tr
                      key={member.userId}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* User Info Column */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs ${avatarColor}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-sans font-bold text-slate-900 text-xs">
                              {member.name}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                              {member.role} · {member.desk}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total Received */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 text-sm">
                        {member.totalReceived}
                      </td>

                      {/* NST Current */}
                      <td className="py-2.5 px-3 text-center text-blue-700 font-semibold bg-blue-50/10 border-l border-slate-100">
                        <input
                          type="number"
                          min="0"
                          value={member.nstCurrent}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'nstCurrent', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* NST Advanced */}
                      <td className="py-2.5 px-3 text-center text-blue-600 bg-blue-50/10 border-r border-slate-100">
                        <input
                          type="number"
                          min="0"
                          value={member.nstAdvanced}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'nstAdvanced', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* BH Current */}
                      <td className="py-2.5 px-3 text-center text-amber-700 font-semibold bg-amber-50/10">
                        <input
                          type="number"
                          min="0"
                          value={member.bhCurrent}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'bhCurrent', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* BH Advanced */}
                      <td className="py-2.5 px-3 text-center text-amber-600 bg-amber-50/10 border-r border-slate-100">
                        <input
                          type="number"
                          min="0"
                          value={member.bhAdvanced}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'bhAdvanced', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* HM Current */}
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-semibold bg-emerald-50/10">
                        <input
                          type="number"
                          min="0"
                          value={member.hmCurrent}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'hmCurrent', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* HM Advanced */}
                      <td className="py-2.5 px-3 text-center text-emerald-600 bg-emerald-50/10 border-r border-slate-100">
                        <input
                          type="number"
                          min="0"
                          value={member.hmAdvanced}
                          onChange={(e) =>
                            handleCellChange(member.userId, 'hmAdvanced', parseInt(e.target.value))
                          }
                          className="w-12 text-center py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white bg-transparent font-mono text-xs focus:outline-none"
                        />
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleQuickAdjust(member.userId, 'nstCurrent', 1)}
                            title="Add 1 NST job"
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(member.userId, 'nstCurrent', -1)}
                            title="Remove 1 NST job"
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* AGGREGATE TOTAL ROW matching Screenshot 9 */}
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-mono text-xs font-bold text-slate-900">
                  <td className="py-3 px-4 uppercase tracking-wider">
                    AGGREGATE TOTAL (8 MEMBERS)
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-extrabold text-slate-900">
                    {totalReceivedSum}
                  </td>
                  <td className="py-3 px-3 text-center text-blue-800 border-l border-slate-200">
                    {nstCurrentSum}
                  </td>
                  <td className="py-3 px-3 text-center text-blue-700 border-r border-slate-200">
                    {nstAdvancedSum}
                  </td>
                  <td className="py-3 px-3 text-center text-amber-800">
                    {bhCurrentSum}
                  </td>
                  <td className="py-3 px-3 text-center text-amber-700 border-r border-slate-200">
                    {bhAdvancedSum}
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-800">
                    {hmCurrentSum}
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-700 border-r border-slate-200">
                    {hmAdvancedSum}
                  </td>
                  <td className="py-3 px-3 text-center text-[10px] text-slate-500">
                    AUTO SYNC
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bottom Status Info */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <div>AUTOMATED AUDIT TRAIL: ALL PRODUCTION COUNTS STAMPED TO DAILY LOG</div>
          <div>CYCLE WINDOW: 00:00 - 23:59 UTC</div>
        </div>
      </div>

      {/* Daily Reset & Archive Confirmation Dialog */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">archive</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Daily Reset & Archive</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Cycle Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              This will archive the current day's job counts ({totalReceivedSum} total received, {totalCurrent} current, {totalAdvanced} advanced) into historical records and reset all 8 desk counters to zero for the next production shift.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1 mb-5">
              <div className="flex justify-between">
                <span>Total Jobs to Archive:</span>
                <span className="font-bold">{totalReceivedSum}</span>
              </div>
              <div className="flex justify-between">
                <span>NST / BH / HM Volume:</span>
                <span>{nstCurrentSum + nstAdvancedSum} / {bhCurrentSum + bhAdvancedSum} / {hmCurrentSum + hmAdvancedSum}</span>
              </div>
              <div className="flex justify-between">
                <span>Authorized By:</span>
                <span className="text-blue-700 font-semibold">{currentUser.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Archive & Reset Daily Counters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Archives Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">history</span>
                <h3 className="text-base font-bold text-slate-900">Archived Shift Records</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {archives.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {record.date}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                      {record.totalReceived} TOTAL JOBS
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                    <div>Current: <span className="font-bold text-slate-800">{record.currentJobs}</span></div>
                    <div>Advanced: <span className="font-bold text-slate-800">{record.advancedJobs}</span></div>
                    <div>Archived By: <span className="text-slate-700">{record.archivedBy}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
