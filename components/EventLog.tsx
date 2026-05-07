'use client'

import { LogEntry } from '@/hooks/useEventLog'

interface Props {
  entries: LogEntry[]
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const typeConfig: Record<
  LogEntry['type'],
  { dot: string; badge: string; label: string }
> = {
  'alarm-on':  { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-600 border-red-200',         label: 'Alarm' },
  'alarm-off': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Cleared' },
  'light-on':  { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200',    label: 'Light' },
  'light-off': { dot: 'bg-slate-400',   badge: 'bg-slate-50 text-slate-600 border-slate-200',    label: 'Light' },
}

const cardStyle: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(148,163,184,0.10) 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.4) 100%)',
  boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.22), 0 10px 40px -16px rgba(148,163,184,0.3)',
}

export default function EventLog({ entries }: Props) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">Recent Events</h2>
        {entries.length > 0 && (
          <span className="text-[11px] text-slate-400">
            {entries.length} event{entries.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="rounded-3xl px-5 py-10 text-center backdrop-blur-xl" style={cardStyle}>
          <p className="text-sm text-slate-500">No events yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Events appear here when gas alarm or light status changes
          </p>
        </div>
      ) : (
        <div
          className="rounded-3xl backdrop-blur-xl overflow-hidden divide-y divide-slate-200/50"
          style={cardStyle}
        >
          {entries.map((entry, i) => {
            const cfg = typeConfig[entry.type]
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/40 ${
                  i === 0 ? 'slide-in' : ''
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <span className="flex-1 text-sm text-slate-700 font-medium">{entry.message}</span>
                <span
                  className={`hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge} shrink-0`}
                >
                  {cfg.label}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
