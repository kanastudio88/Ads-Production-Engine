import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32, showBadge = false }) => {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Rounded square container */}
        <rect width="100" height="100" rx="24" fill="#1B2232" />
        
        {/* Main Blue 'D' Shape */}
        <path
          d="M 28 25 L 56 25 C 72 25 82 35 82 50 C 82 65 72 75 56 75 L 28 75 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Middle Crossbar */}
        <line
          x1="28"
          y1="50"
          x2="56"
          y2="50"
          stroke="#60A5FA"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Checkmark gray accent slicing through bottom right */}
        <path
          d="M 36 82 L 48 94 L 88 52"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Bright green status dot */}
        <circle cx="82" cy="28" r="8" fill="#10B981" />
      </svg>
      {showBadge && (
        <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-100 font-mono text-[9px] font-bold tracking-wider uppercase border border-zinc-700 shadow-xs">
          V5.5
        </span>
      )}
    </div>
  );
};
