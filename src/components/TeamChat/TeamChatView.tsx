import React, { useState, useRef, useEffect } from 'react';
import { TeamMember, TeamChatMessage, LayoutDocument } from '../../types';

interface TeamChatViewProps {
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  currentDoc: LayoutDocument;
  onApplyChatSnippetToDoc?: (text: string) => void;
}

export const TeamChatView: React.FC<TeamChatViewProps> = ({
  currentUser,
  teamMembers,
  currentDoc
}) => {
  const [messages, setMessages] = useState<TeamChatMessage[]>(() => {
    const saved = localStorage.getItem('st8_team_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
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
  });

  const [activeChannel, setActiveChannel] = useState<string>('#production-floor');
  const [inputText, setInputText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages
  useEffect(() => {
    localStorage.setItem('st8_team_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderSeat: currentUser.seatNumber,
      avatarColor: currentUser.avatarColor || 'bg-blue-600',
      message: inputText.trim(),
      timestamp: timeStr,
      channel: activeChannel,
      jobTag: selectedTag || undefined
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setSelectedTag('');
  };

  const handleShareCurrentLayout = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const proofSummary = `[PROOF SHARE] ${currentDoc.title || 'NOTIS IKLAN'} · ${currentDoc.frameWidth}x${currentDoc.frameHeight}mm · 5pt Text · 6pt Header · Gutter 0.5mm · 0 Overset Fit.`;

    const newMsg: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderSeat: currentUser.seatNumber,
      avatarColor: currentUser.avatarColor || 'bg-blue-600',
      message: proofSummary,
      timestamp: timeStr,
      channel: activeChannel,
      jobTag: 'CS5.5-PROOF-SHARE',
      attachmentType: 'layout_proof',
      attachmentData: currentDoc.kicker
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleQuickStatus = (statusText: string) => {
    setInputText(statusText);
  };

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  const channels = [
    { id: '#production-floor', name: 'Production Floor', icon: 'forum', desc: 'Main team operational dispatch' },
    { id: '#urgent-proofs', name: 'Urgent Proofs', icon: 'campaign', desc: 'Deadlines & press cutoff alerts' },
    { id: '#court-notices', name: 'Court & Legal Notices', icon: 'gavel', desc: 'Writ Saman & Gazette verifications' },
    { id: '#daily-handover', name: 'Shift Handover', icon: 'published_with_changes', desc: 'End of shift notes' }
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-white select-none">
      {/* 1. Left Channel & Colleague Navigation Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col justify-between flex-shrink-0">
        <div className="p-3 space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">chat</span>
              <span className="font-bold text-xs text-slate-900 tracking-tight">TEAM CHAT & DISPATCH</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Sync Active"></span>
          </div>

          {/* Channels Group */}
          <div>
            <div className="px-1.5 py-1 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CHANNELS
            </div>
            <div className="space-y-0.5 mt-1">
              {channels.map((ch) => {
                const isActive = activeChannel === ch.id;
                const count = messages.filter((m) => m.channel === ch.id).length;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[16px] opacity-80">{ch.icon}</span>
                      <span className="truncate">{ch.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Online Colleagues Group */}
          <div>
            <div className="px-1.5 py-1 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>TEAM OPERATORS</span>
              <span className="text-emerald-600 font-bold">
                {teamMembers.filter((m) => m.isOnline).length} ONLINE
              </span>
            </div>
            <div className="space-y-1 mt-1">
              {teamMembers.map((member) => {
                const isSelf = member.id === currentUser.id;
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-1.5 rounded-lg border text-xs transition-all ${
                      isSelf ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center text-white flex-shrink-0 ${
                          member.avatarColor || 'bg-blue-600'
                        }`}
                      >
                        {member.seatNumber}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate">
                          {member.name} {isSelf && '(You)'}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">
                          {member.desk}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        member.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-300'
                      }`}
                      title={member.isOnline ? 'Online & Active' : 'Standby'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Share Layout Action */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <button
            type="button"
            onClick={handleShareCurrentLayout}
            className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>Share Current Ad Layout</span>
          </button>
        </div>
      </div>

      {/* 2. Main Chat Conversation Stream */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-100/50">
        {/* Channel Top Bar */}
        <div className="h-12 px-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{activeChannel}</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              {channels.find((c) => c.id === activeChannel)?.desc}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">
              ENCRYPTED INTERNAL BUS
            </span>
          </div>
        </div>

        {/* Message Feed Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-4xl opacity-40">forum</span>
              <div className="text-xs font-medium">Tiada mesej lagi dalam saluran ini.</div>
              <div className="text-[11px] text-slate-400">Mulakan perbincangan dengan pasukan pengeluaran anda.</div>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelf = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-2xl ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Sender Seat Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center text-white flex-shrink-0 shadow-2xs ${
                      msg.avatarColor || 'bg-slate-700'
                    }`}
                  >
                    {msg.senderSeat}
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`p-3 rounded-xl border text-xs shadow-xs transition-all ${
                      isSelf
                        ? 'bg-blue-600 text-white border-blue-600 rounded-tr-none'
                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Header */}
                    <div
                      className={`flex items-center gap-2 mb-1 text-[10px] font-mono ${
                        isSelf ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span className="font-bold">{msg.senderName}</span>
                      <span>·</span>
                      <span>{msg.senderRole}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Job Tag Badge if present */}
                    {msg.jobTag && (
                      <div className="mb-1.5 inline-block">
                        <span
                          className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelf
                              ? 'bg-blue-700 text-blue-100 border border-blue-500/40'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          🏷 {msg.jobTag}
                        </span>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.message}</div>

                    {/* Layout Proof Attachment Card if present */}
                    {msg.attachmentType === 'layout_proof' && (
                      <div
                        className={`mt-2 p-2 rounded border font-mono text-[10px] ${
                          isSelf
                            ? 'bg-blue-700/60 border-blue-400 text-blue-50'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold mb-0.5">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>InDesign CS5.5 Prepress Proof Snapshot</span>
                        </div>
                        <div className="text-[9px] opacity-80">
                          {currentDoc.edition} · {currentDoc.frameWidth}x{currentDoc.frameHeight}mm · 0.5pt Border
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Shortcuts */}
        <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] flex-shrink-0">
          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase mr-1">Quick:</span>
          <button
            type="button"
            onClick={() => handleQuickStatus('Layout verified · 5pt body · 6pt header · 0 overset passed.')}
            className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            ✔ Layout Verified
          </button>
          <button
            type="button"
            onClick={() => handleQuickStatus('KWSP Court Notice ready for press release.')}
            className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            📄 Notice Ready
          </button>
          <button
            type="button"
            onClick={() => handleQuickStatus('Please check pre-flight proof on Desk 01.')}
            className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            🔍 Review Proof
          </button>
        </div>

        {/* 3. Input Text Box & Dispatch Controls */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Hantar mesej ke ${activeChannel} sebagai ${currentUser.name}...`}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-sans"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputText.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Hantar</span>
            <span className="material-symbols-outlined text-[15px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
