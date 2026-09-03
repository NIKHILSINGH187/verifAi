
import React from 'react'
import { cn } from '@/lib/utils'

interface ScanningIndicatorProps {
  progress: number
}

/**
 * ScanningIndicator
 * Animated circular scanning indicator with rotating rings and progress overlay.
 * Displays the current processing progress (0-100).
 */
export default function ScanningIndicator({ progress }: ScanningIndicatorProps) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer rotating ring */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin"
        style={{ animationDuration: '3s' }}
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          opacity="0.3"
          strokeDasharray="10 5"
        />
      </svg>

      {/* Middle pulsing ring */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r={radius - 20}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>

      {/* Progress arc */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s ease-out',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-primary tracking-tight">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
          Scanning
        </span>
      </div>

      {/* Decorative corner markers */}
      {[0, 90, 180, 270].map((angle) => (
        <div
          key={angle}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            top: `calc(50% + ${80 * Math.sin((angle * Math.PI) / 180)}px)`,
            left: `calc(50% + ${80 * Math.cos((angle * Math.PI) / 180)}px)`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
