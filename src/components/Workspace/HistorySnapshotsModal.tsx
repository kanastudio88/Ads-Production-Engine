import React, { useState } from 'react';
import { DocSnapshot, LayoutDocument } from '../../types';

interface HistorySnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: DocSnapshot[];
  currentDoc: LayoutDocument;
  onTakeSnapshot: (note: string) => void;
  onRestoreSnapshot: (snapshot: DocSnapshot) => void;
  onClearHistory: () => void;
}

export const HistorySnapshotsModal: React.FC<HistorySnapshotsModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  currentDoc,
  onTakeSnapshot,
  onRestoreSnapshot,
  onClearHistory
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onTakeSnapshot(newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-xl">history</span>
            <h2 className="font-bold text-sm tracking-wide">VERSION HISTORY & SNAPSHOTS</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Create Snapshot Form */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSave} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Label this version (e.g. 'Draft 2 - Client Corrections')..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">bookmark_add</span>
              <span>Save Snapshot</span>
            </button>
          </form>
        </div>

        {/* Snapshots List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-2.5">
          {snapshots.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">save</span>
              <p>No snapshots saved yet for this session.</p>
            </div>
          ) : (
            snapshots.map((snap, idx) => (
              <div
                key={snap.id}
                className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-lg shadow-xs flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      v{snapshots.length - idx}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{snap.actionNote || snap.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>{new Date(snap.timestamp).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>{snap.doc.frameHeight / 10}x{snap.doc.columns} Box</span>
                    <span>•</span>
                    <span>{snap.doc.fontSize}pt</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onRestoreSnapshot(snap);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">restore</span>
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClearHistory}
            className="text-red-600 hover:text-red-800 text-[11px] font-semibold cursor-pointer"
          >
            Clear History
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
