'use client'

import { Wind, ArrowUp, ArrowDown } from 'lucide-react'
import SparklineChart from './SparklineChart'
import AnimatedNumber from './AnimatedNumber'
import { StatusInfo, statusBadgeClass } from '@/lib/sensorStatus'

interface Props {
  value: number | null
  gasAlarm: boolean
  history: number[]
  status: StatusInfo
}

export default function GasCard({ value, gasAlarm, history, status }: Props) {
  const trend =
    history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : null
  const min = history.length > 0 ? Math.min(...history) : null
  const max = history.length > 0 ? Math.max(...history) : null

  const accentHex = gasAlarm ? '#ef4444' : status.status === 'warning' ? '#f59e0b' : '#94a3b8'
  const valueColor = gasAlarm
    ? 'text-red-600'
    : status.status === 'warning'
    ? 'text-amber-700'
    : 'text-slate-900'

  return (
    <div
      className="group relative rounded-2xl p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 h-full flex flex-col"
      style={{
        background: gasAlarm
          ? `linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.35) 100%)`
          : `linear-gradient(135deg, ${accentHex}1f 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.4) 100%)`,
        boxShadow: gasAlarm
          ? `inset 0 0 0 1.5px rgba(239,68,68,0.55), 0 8px 28px -10px rgba(239,68,68,0.45)`
          : `inset 0 0 0 1px ${accentHex}33, 0 8px 28px -14px ${accentHex}55`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="p-1.5 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${accentHex}26` }}
          >
            <Wind size={14} style={{ color: accentHex }} />
          </div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            Gas Level
          </p>
        </div>
        {status.label && (
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${statusBadgeClass[status.status]}`}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Alarm banner */}
      {gasAlarm && (
        <div className="bg-red-500/15 border border-red-300/60 rounded-lg px-2 py-1.5 mb-2 flex items-center gap-1.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <span className="text-[10px] font-bold text-red-700 tracking-wide">GAS LEAK DETECTED</span>
        </div>
      )}

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <p
          className={`text-4xl font-bold tracking-tight tabular-nums leading-none transition-colors duration-500 ${valueColor}`}
        >
          <AnimatedNumber value={value} decimals={0} />
        </p>
        <span className="text-[10px] text-slate-400 self-end mb-1">raw ADC</span>
      </div>

      {/* Trend + range */}
      <div className="flex items-center gap-2.5 text-[11px] mb-2 min-h-[1rem]">
        {trend !== null && Math.abs(trend) > 0 && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              trend > 0 ? 'text-red-500' : 'text-emerald-600'
            }`}
          >
            {trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {Math.abs(trend)}
          </span>
        )}
        {min !== null && max !== null && history.length > 1 ? (
          <span className="text-slate-500 tabular-nums">
            {min} – {max}
          </span>
        ) : (
          <span className="text-slate-400">Collecting samples…</span>
        )}
      </div>

      {/* Sparkline */}
      <div className="flex-1 min-h-[44px] flex items-end">
        <div className="w-full">
          <SparklineChart data={history} color={accentHex} gradientId="gas-gradient" />
        </div>
      </div>
    </div>
  )
}
