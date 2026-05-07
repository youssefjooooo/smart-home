'use client'

import { useEffect, useRef, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { getDb } from '@/lib/firebase'

const MAX_HISTORY = 20

export interface SmartHomeState {
  temperature: number | null
  humidity: number | null
  gas: number | null
  gasAlarm: boolean
  lightOn: boolean
  lastUpdated: Date | null
  loading: boolean
  error: string | null
  stale: boolean
  tempHistory: number[]
  humidityHistory: number[]
  gasHistory: number[]
}

const STALE_THRESHOLD_MS = 30_000

function addToHistory(prev: number[], value: number): number[] {
  return [...prev.slice(-(MAX_HISTORY - 1)), value]
}

export function useSmartHome(): SmartHomeState {
  const [temperature, setTemperature] = useState<number | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [gas, setGas] = useState<number | null>(null)
  const [gasAlarm, setGasAlarm] = useState(false)
  const [lightOn, setLightOn] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tempHistory, setTempHistory] = useState<number[]>([])
  const [humidityHistory, setHumidityHistory] = useState<number[]>([])
  const [gasHistory, setGasHistory] = useState<number[]>([])
  const [stale, setStale] = useState(false)

  useEffect(() => {
    if (!lastUpdated) return
    const check = () => setStale(Date.now() - lastUpdated.getTime() > STALE_THRESHOLD_MS)
    check()
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [lastUpdated])

  const loaded = useRef({ temp: false, hum: false, gas: false, alarm: false, light: false })

  function markLoaded(key: keyof typeof loaded.current) {
    loaded.current[key] = true
    const { temp, hum, gas, alarm, light } = loaded.current
    if (temp && hum && gas && alarm && light) setLoading(false)
  }

  useEffect(() => {
    const unsubs: Array<() => void> = []

    try {
      const db = getDb()

      const tempUnsub = onValue(
        ref(db, '/home/sensors/temperature'),
        (snap) => {
          const val = snap.val() as number | null
          if (val !== null) {
            setTemperature(val)
            setTempHistory((prev) => addToHistory(prev, val))
            setLastUpdated(new Date())
          }
          markLoaded('temp')
        },
        (err) => { setError(err.message); setLoading(false) }
      )
      unsubs.push(tempUnsub)

      const humUnsub = onValue(
        ref(db, '/home/sensors/humidity'),
        (snap) => {
          const val = snap.val() as number | null
          if (val !== null) {
            setHumidity(val)
            setHumidityHistory((prev) => addToHistory(prev, val))
            setLastUpdated(new Date())
          }
          markLoaded('hum')
        },
        (err) => { setError(err.message); setLoading(false) }
      )
      unsubs.push(humUnsub)

      const gasUnsub = onValue(
        ref(db, '/home/sensors/gas'),
        (snap) => {
          const val = snap.val() as number | null
          if (val !== null) {
            setGas(val)
            setGasHistory((prev) => addToHistory(prev, val))
            setLastUpdated(new Date())
          }
          markLoaded('gas')
        },
        (err) => { setError(err.message); setLoading(false) }
      )
      unsubs.push(gasUnsub)

      const alarmUnsub = onValue(
        ref(db, '/home/status/gasAlarm'),
        (snap) => {
          setGasAlarm(snap.val() ?? false)
          setLastUpdated(new Date())
          markLoaded('alarm')
        },
        (err) => { setError(err.message); setLoading(false) }
      )
      unsubs.push(alarmUnsub)

      const lightUnsub = onValue(
        ref(db, '/home/status/lightOn'),
        (snap) => {
          setLightOn(snap.val() ?? false)
          setLastUpdated(new Date())
          markLoaded('light')
        },
        (err) => { setError(err.message); setLoading(false) }
      )
      unsubs.push(lightUnsub)
    } catch (err) {
      setError(String(err))
      setLoading(false)
    }

    return () => unsubs.forEach((u) => u())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    temperature,
    humidity,
    gas,
    gasAlarm,
    lightOn,
    lastUpdated,
    loading,
    error,
    stale,
    tempHistory,
    humidityHistory,
    gasHistory,
  }
}
