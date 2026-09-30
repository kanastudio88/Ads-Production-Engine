import React, { useState } from 'react';
import { TeamMember } from '../types';
import { Logo } from './Logo';

interface LoginPageProps {
  teamMembers: TeamMember[];
  onSelectUser: (user: TeamMember) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ teamMembers, onSelectUser }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');
  const [emailInput, setEmailInput] = useState('alex.c@studio8internal.corp');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSso = () => {
    setIsAuthenticating(true);
    setAuthError(null);
    setAuthStep('CONNECTING TO ACCOUNTS.GOOGLE.COM...');

    const trimmed = emailInput.trim().toLowerCase();
    const match =
      teamMembers.find(
        (m) => m.email.toLowerCase() === trimmed || m.name.toLowerCase().includes(trimmed.split('@')[0])
      ) || teamMembers[0];

    setTimeout(() => {
      setAuthStep('VALIDATING GOOGLE SSO CREDENTIALS...');
    }, 500);

    setTimeout(() => {
      setAuthStep('AUTHENTICATION VERIFIED. INITIALIZING WORKSPACE...');
      setTimeout(() => {
        setIsAuthenticating(false);
        onSelectUser({ ...match, isOnline: true });
      }, 500);
    }, 1100);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#fbf8ff] text-[#1b1b21] font-sans antialiased select-none">
      <div className="flex flex-col w-full max-w-md items-center justify-center py-4">
        {/* Main Authentication Terminal Card */}
        <div className="w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative">
          {/* Precision Calibration Header Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400"></div>

          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Brand Unit */}
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 shadow-xs border border-slate-100 flex items-center justify-center">
                <Logo size={48} />
              </div>
              <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-100 font-mono text-[10px] font-bold tracking-widest uppercase">
                V5.5
              </span>
            </div>

            {/* Typography Stack */}
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Studio8 Production Engine
            </h1>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Precision Publishing & Automated InDesign CS5.5 Prepress Suite
            </p>

            {/* SSO Unit */}
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-full text-left">
                <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Google Workspace Account
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@studio8internal.corp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <button
                disabled={isAuthenticating}
                onClick={handleGoogleSso}
                className={`group w-full py-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-between px-4 relative overflow-hidden ${
                  isAuthenticating ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                }`}
                type="button"
              >
                {/* Authentic Google Multi-Color SVG Mark */}
                <div className="flex items-center gap-3">
                  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.39 7.34 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.43l4.04-3.14z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.61 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs font-semibold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                      Sign in with Google Account
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors text-base">
                  arrow_forward
                </span>
              </button>

              {/* Active Terminal Feedback console */}
              {isAuthenticating && (
                <div className="mt-3 w-full p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-left text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                    <span className="text-blue-300 font-medium">{authStep}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {authError && (
                <div className="mt-2 w-full p-2 rounded bg-red-50 border border-red-200 text-red-700 text-xs text-left font-mono">
                  {authError}
                </div>
              )}
            </div>
          </div>

          {/* Compact Technical Bar Footer */}
          <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[10px] text-slate-500 font-medium">SYS AUTH READY</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400">BUILD: v5.5.109</div>
          </div>
        </div>
      </div>
    </div>
  );
};
