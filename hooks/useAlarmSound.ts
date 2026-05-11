'use client'

import { useEffect, useRef } from 'react'

const BEEP_FREQ_HZ = 880 // A5 — piercing alarm tone
const BEEP_DURATION_S = 0.18
const BEEP_VOLUME = 0.2
const BEEP_INTERVAL_MS = 650

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext
}

function getAudioContextClass(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null
  const w = window as WindowWithWebkit
  return window.AudioContext ?? w.webkitAudioContext ?? null
}

/**
 * Plays a repeating beep through the Web Audio API while `active` is true.
 * Honors browser autoplay policy — primes the AudioContext on the first
 * user gesture so the beep can fire even if the alarm triggers without
 * any prior interaction once the user clicks anywhere.
 */
export function useAlarmSound(active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<number | null>(null)

  // Prime the AudioContext on first user gesture (unblocks autoplay)
  useEffect(() => {
    const unlock = () => {
      if (!ctxRef.current) {
        const Ctor = getAudioContextClass()
        if (!Ctor) return
        try {
          ctxRef.current = new Ctor()
        } catch {
          return
        }
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume().catch(() => {})
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  // Start / stop the beep loop in response to `active`
  useEffect(() => {
    if (!active) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const ensureCtx = (): AudioContext | null => {
      if (ctxRef.current) return ctxRef.current
      const Ctor = getAudioContextClass()
      if (!Ctor) return null
      try {
        ctxRef.current = new Ctor()
        return ctxRef.current
      } catch {
        return null
      }
    }

    const playBeep = () => {
      const ctx = ensureCtx()
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume().catch(() => {})

      try {
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        osc.frequency.value = BEEP_FREQ_HZ

        // Short envelope to avoid clicks
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(BEEP_VOLUME, now + 0.015)
        gain.gain.setValueAtTime(BEEP_VOLUME, now + BEEP_DURATION_S - 0.03)
        gain.gain.linearRampToValueAtTime(0, now + BEEP_DURATION_S)

        osc.connect(gain).connect(ctx.destination)
        osc.start(now)
        osc.stop(now + BEEP_DURATION_S)
      } catch {
        // ignore — page may be backgrounded or context closed
      }
    }

    playBeep()
    intervalRef.current = window.setInterval(playBeep, BEEP_INTERVAL_MS)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [active])

  // Close AudioContext on unmount
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current
      if (ctx) {
        ctx.close().catch(() => {})
        ctxRef.current = null
      }
    }
  }, [])
}
