'use client'

import { useEffect, useRef, useState } from 'react'

export interface LogEntry {
  id: string
  timestamp: Date
  message: string
  type: 'alarm-on' | 'alarm-off' | 'light-on' | 'light-off'
}

const MAX_ENTRIES = 20

export function useEventLog(gasAlarm: boolean, lightOn: boolean, loading: boolean): LogEntry[] {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const prevAlarm = useRef<boolean | null>(null)
  const prevLight = useRef<boolean | null>(null)

  function addEntry(entry: Omit<LogEntry, 'id'>) {
    setEntries((prev) =>
      [{ ...entry, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, MAX_ENTRIES)
    )
  }

  useEffect(() => {
    if (loading) return

    if (prevAlarm.current !== null && prevAlarm.current !== gasAlarm) {
      addEntry({
        timestamp: new Date(),
        message: gasAlarm ? '⚠ Gas alarm triggered' : '✓ Gas alarm cleared',
        type: gasAlarm ? 'alarm-on' : 'alarm-off',
      })
    }
    prevAlarm.current = gasAlarm
  }, [gasAlarm, loading])

  useEffect(() => {
    if (loading) return

    if (prevLight.current !== null && prevLight.current !== lightOn) {
      addEntry({
        timestamp: new Date(),
        message: `💡 Light turned ${lightOn ? 'ON' : 'OFF'}`,
        type: lightOn ? 'light-on' : 'light-off',
      })
    }
    prevLight.current = lightOn
  }, [lightOn, loading])

  return entries
}
