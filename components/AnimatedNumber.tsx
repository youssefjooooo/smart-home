'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number | null
  decimals?: number
  duration?: number
  fallback?: React.ReactNode
}

export default function AnimatedNumber({
  value,
  decimals = 1,
  duration = 600,
  fallback = <span className="text-slate-300">—</span>,
}: Props) {
  const [display, setDisplay] = useState<number | null>(value)
  const fromRef = useRef<number | null>(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    if (value === null) {
      setDisplay(null)
      fromRef.current = null
      return
    }

    const from = fromRef.current
    if (from === null || from === value) {
      setDisplay(value)
      fromRef.current = value
      return
    }

    let start: number | null = null
    const step = (now: number) => {
      if (start === null) start = now
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (value - from) * eased
      setDisplay(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = value
      }
    }
    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  if (display === null) return <>{fallback}</>

  const formatted = decimals === 0 ? Math.round(display).toString() : display.toFixed(decimals)
  return <>{formatted}</>
}
