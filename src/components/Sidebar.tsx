import React from 'react';

export type ActiveTab = 'traffic' | 'workspace' | 'dailySummary' | 'teamChat';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenTrafficController: () => void;
  trafficSheetUrl: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTrafficController,
  trafficSheetUrl
}) => {
  return (
    <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col justify-between select-none flex-shrink-0">
      <div className="p-3">
        {/* Section Label */}
        <div className="px-2 py-1 mb-2 font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          WORKSPACE MODULES
        </div>

        {/* Navigation Options */}
        <nav className="space-y-1">
          {/* Button 1 — Traffic Controller */}
          <button
            onClick={onOpenTrafficController}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
              activeTab === 'traffic'
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 active:bg-slate-300/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[17px] opacity-80 group-hover:opacity-100">
                table_chart
              </span>
              <span>Traffic Controller</span>
            </div>
            <span className="material-symbols-outlined text-[14px] opacity-60 group-hover:opacity-100">
              open_in_new
            </span>
          </button>

          {/* Button 2 — Workspace (InDesign 5.5 Style Artwork Design) */}
          <button
            onClick={() => onSelectTab('workspace')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 active:bg-slate-300/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[17px] opacity-80 group-hover:opacity-100">
                crop_free
              </span>
              <span>Workspace</span>
            </div>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                activeTab === 'workspace'
                  ? 'bg-blue-700/80 text-blue-100 border border-blue-500/40'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              CS5.5
            </span>
          </button>

          {/* Button 3 — Team Chat & Messaging */}
          <button
            onClick={() => onSelectTab('teamChat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
              activeTab === 'teamChat'
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 active:bg-slate-300/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[17px] opacity-80 group-hover:opacity-100">
                chat
              </span>
              <span>Team Chat</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Button 4 — Daily Summary (Team Daily Performance & Job Tracking) */}
          <button
            onClick={() => onSelectTab('dailySummary')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
              activeTab === 'dailySummary'
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 active:bg-slate-300/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[17px] opacity-80 group-hover:opacity-100">
                bar_chart
              </span>
              <span>Daily Summary</span>
            </div>
            <span className="material-symbols-outlined text-[14px] opacity-50">
              history
            </span>
          </button>
        </nav>
      </div>

      {/* Persistent Diagnostics Sidebar Footer matching Screenshot 7 & 9 */}
      <div className="p-3 border-t border-slate-200 bg-slate-100/70 font-mono text-[10px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">SOCKET 12MS</span>
          </div>
          <span className="text-slate-400">v5.5-r4</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 pt-0.5">
          <span>⌘K Rails</span>
          <span>ESC Reset</span>
        </div>
      </div>
    </aside>
  );
};
