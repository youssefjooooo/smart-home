'use client'

import { Lightbulb } from 'lucide-react'

interface Props {
  lightOn: boolean
}

export default function LightCard({ lightOn }: Props) {
  const accentHex = lightOn ? '#f59e0b' : '#94a3b8'

  return (
    <div
      className="group relative rounded-2xl p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 overflow-hidden h-full flex flex-col"
      style={{
        background: lightOn
          ? `linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(254,243,199,0.55) 45%, rgba(255,255,255,0.45) 100%)`
          : `linear-gradient(135deg, rgba(148,163,184,0.18) 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.4) 100%)`,
        boxShadow: lightOn
          ? `inset 0 0 0 1px rgba(245,158,11,0.4), 0 8px 28px -10px rgba(245,158,11,0.4)`
          : `inset 0 0 0 1px rgba(148,163,184,0.25), 0 8px 28px -14px rgba(148,163,184,0.35)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Auto Light
        </p>
        <div className="flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              lightOn ? 'bg-amber-400' : 'bg-slate-300'
            }`}
          />
          <span
            className={`text-[9px] font-semibold uppercase tracking-wider transition-colors duration-500 ${
              lightOn ? 'text-amber-700' : 'text-slate-400'
            }`}
          >
            {lightOn ? 'Active' : 'Idle'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center">
          {lightOn && (
            <div className="absolute w-24 h-24 rounded-full bg-amber-300/50 blur-2xl glow-pulse" />
          )}
          <div
            className="relative p-4 rounded-full transition-all duration-500 backdrop-blur-sm"
            style={{
              background: lightOn ? 'rgba(254,243,199,0.7)' : 'rgba(241,245,249,0.7)',
              boxShadow: lightOn
                ? '0 6px 20px -6px rgba(245,158,11,0.5), inset 0 0 0 1px rgba(245,158,11,0.3)'
                : 'inset 0 0 0 1px rgba(148,163,184,0.2)',
            }}
          >
            <Lightbulb
              size={36}
              strokeWidth={1.5}
              className="transition-all duration-500"
              style={{ color: accentHex }}
              fill={lightOn ? '#fde68a' : 'none'}
            />
          </div>
        </div>

        <div className="text-center">
          <p
            className={`text-2xl font-bold transition-colors duration-500 leading-none ${
              lightOn ? 'text-amber-700' : 'text-slate-400'
            }`}
          >
            {lightOn ? 'ON' : 'OFF'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {lightOn ? 'Lights are active' : 'Lights are off'}
          </p>
        </div>
      </div>
    </div>
  )
}
