'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'
import SparklineChart from './SparklineChart'
import AnimatedNumber from './AnimatedNumber'
import { StatusInfo, statusBadgeClass } from '@/lib/sensorStatus'

interface Props {
  title: string
  value: number | null
  unit: string
  history: number[]
  icon: React.ReactNode
  accentHex: string
  gradientId: string
  decimals?: number
  status: StatusInfo
}

export default function SensorCard({
  title,
  value,
  unit,
  history,
  icon,
  accentHex,
  gradientId,
  decimals = 1,
  status,
}: Props) {
  const trend =
    history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : null
  const min = history.length > 0 ? Math.min(...history) : null
  const max = history.length > 0 ? Math.max(...history) : null
  const hasValue = value !== null

  return (
    <div
      className="group relative rounded-2xl p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${accentHex}1f 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.4) 100%)`,
        boxShadow: `inset 0 0 0 1px ${accentHex}33, 0 8px 28px -14px ${accentHex}55`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="p-1.5 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${accentHex}26` }}
          >
            {icon}
          </div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest truncate">
            {title}
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

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <p className="text-4xl font-bold tracking-tight tabular-nums leading-none text-slate-900">
          <AnimatedNumber value={value} decimals={decimals} />
        </p>
        {hasValue && (
          <span className="text-lg font-medium text-slate-400 leading-none">{unit}</span>
        )}
      </div>

      {/* Trend + range */}
      <div className="flex items-center gap-2.5 text-[11px] mb-2 min-h-[1rem]">
        {trend !== null && Math.abs(trend) > 0.01 && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              trend > 0 ? 'text-red-500' : 'text-emerald-600'
            }`}
          >
            {trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {Math.abs(trend).toFixed(decimals)}
            {unit}
          </span>
        )}
        {min !== null && max !== null && history.length > 1 ? (
          <span className="text-slate-500 tabular-nums">
            {min.toFixed(decimals)} – {max.toFixed(decimals)}
            {unit}
          </span>
        ) : (
          <span className="text-slate-400">Collecting samples…</span>
        )}
      </div>

      {/* Sparkline */}
      <div className="flex-1 min-h-[44px] flex items-end">
        <div className="w-full">
          <SparklineChart data={history} color={accentHex} gradientId={gradientId} />
        </div>
      </div>
    </div>
  )
}
