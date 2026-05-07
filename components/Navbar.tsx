'use client'

import { useEffect, useState } from 'react'
import { Clock, WifiOff } from 'lucide-react'

function formatRelative(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 5) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

interface Props {
  lastUpdated: Date | null
  hasData: boolean
  gasAlarm: boolean
  stale: boolean
}

export default function Navbar({ lastUpdated, hasData, gasAlarm, stale }: Props) {
  const [relativeTime, setRelativeTime] = useState('')
  const [clock, setClock] = useState('')
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!lastUpdated) return
    setRelativeTime(formatRelative(lastUpdated))
    setPulsing(true)
    const ping = setTimeout(() => setPulsing(false), 700)
    const interval = setInterval(() => setRelativeTime(formatRelative(lastUpdated)), 1000)
    return () => {
      clearTimeout(ping)
      clearInterval(interval)
    }
  }, [lastUpdated])

  const showLive = hasData && !stale
  const indicatorColor = gasAlarm ? 'bg-white' : stale ? 'bg-amber-400' : 'bg-emerald-500'

  return (
    <header
      className="sticky top-0 z-20 transition-all duration-500 backdrop-blur-xl"
      style={{
        background: gasAlarm
          ? 'linear-gradient(to bottom, rgba(220,38,38,0.85) 0%, rgba(185,28,28,0.75) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0.35) 100%)',
        boxShadow: gasAlarm
          ? 'inset 0 -1px 0 rgba(220,38,38,0.5), 0 4px 24px -8px rgba(239,68,68,0.4)'
          : 'inset 0 -1px 0 rgba(148,163,184,0.18), 0 4px 24px -16px rgba(148,163,184,0.4)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: logo */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-500 ${
              gasAlarm ? 'bg-white' : 'bg-slate-900'
            }`}
            style={
              gasAlarm
                ? undefined
                : { boxShadow: '0 4px 12px -4px rgba(15,23,42,0.4)' }
            }
          >
            <span
              className={`text-xs font-black leading-none ${
                gasAlarm ? 'text-red-700' : 'text-white'
              }`}
            >
              S
            </span>
          </div>
          <span
            className={`font-semibold tracking-tight transition-colors duration-500 ${
              gasAlarm ? 'text-white' : 'text-slate-900'
            }`}
          >
            SmartHome
          </span>

          {gasAlarm && (
            <span className="bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse tracking-wide border border-white/30">
              ⚠ ALARM
            </span>
          )}
          {!gasAlarm && stale && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-50/80 backdrop-blur-sm text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide stale-blink">
              <WifiOff size={10} />
              Stale
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm">
          <div
            className={`hidden sm:flex items-center gap-1.5 font-mono text-xs tabular-nums ${
              gasAlarm ? 'text-red-100' : 'text-slate-500'
            }`}
          >
            <Clock size={11} />
            {clock}
          </div>

          <div className={`hidden sm:block w-px h-4 ${gasAlarm ? 'bg-red-400/60' : 'bg-slate-300/60'}`} />

          {hasData && lastUpdated && (
            <span
              className={`hidden sm:block text-xs ${
                gasAlarm ? 'text-red-100' : stale ? 'text-amber-600' : 'text-slate-500'
              }`}
            >
              Updated {relativeTime}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full transition-all duration-500 ${
                  pulsing && showLive ? 'opacity-75 scale-150' : 'opacity-0'
                } ${indicatorColor}`}
              />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${indicatorColor}`} />
            </span>
            <span
              className={`font-medium text-xs ${
                gasAlarm ? 'text-white' : stale ? 'text-amber-700' : 'text-emerald-600'
              }`}
            >
              {stale ? 'Stale' : 'Live'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
