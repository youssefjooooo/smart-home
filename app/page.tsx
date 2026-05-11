'use client'

import { Thermometer, Droplets, AlertCircle } from 'lucide-react'
import { useSmartHome } from '@/hooks/useSmartHome'
import { useEventLog } from '@/hooks/useEventLog'
import { useAlarmSound } from '@/hooks/useAlarmSound'
import { temperatureStatus, humidityStatus, gasStatus } from '@/lib/sensorStatus'
import Navbar from '@/components/Navbar'
import SensorCard from '@/components/SensorCard'
import GasCard from '@/components/GasCard'
import LightCard from '@/components/LightCard'
import EventLog from '@/components/EventLog'
import LoadingSkeleton from '@/components/LoadingSkeleton'

export default function DashboardPage() {
  const {
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
  } = useSmartHome()

  const logEntries = useEventLog(gasAlarm, lightOn, loading)
  useAlarmSound(gasAlarm)

  const tempStatus = temperatureStatus(temperature)
  const humStatus = humidityStatus(humidity)
  const gStatus = gasStatus(gas, gasAlarm)

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
        gasAlarm ? 'bg-red-100' : 'bg-slate-50'
      }`}
    >
      {/* Decorative gradient blobs (give backdrop-blur something to blur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {gasAlarm ? (
          <>
            <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-red-300/50 blur-3xl" />
            <div className="absolute top-40 -right-32 w-[520px] h-[520px] rounded-full bg-rose-300/40 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] rounded-full bg-orange-200/40 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-blue-200/45 blur-3xl" />
            <div className="absolute top-40 -right-32 w-[520px] h-[520px] rounded-full bg-teal-200/45 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] rounded-full bg-amber-100/40 blur-3xl" />
          </>
        )}
      </div>

      <div className="relative z-10">
        <Navbar
          lastUpdated={lastUpdated}
          hasData={!loading && !error}
          gasAlarm={gasAlarm}
          stale={stale}
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          {/* Page header */}
          <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1
                className={`text-base font-semibold transition-colors duration-500 ${
                  gasAlarm ? 'text-red-900' : 'text-slate-900'
                }`}
              >
                Dashboard
              </h1>
              <p
                className={`text-xs transition-colors duration-500 ${
                  gasAlarm ? 'text-red-700/80' : 'text-slate-500'
                }`}
              >
                Real-time sensor readings — streaming from Firebase
              </p>
            </div>

            {!loading && !error && stale && (
              <div className="flex items-center gap-1.5 text-[11px] bg-amber-50/80 backdrop-blur border border-amber-200 text-amber-700 rounded-full px-2.5 py-1 fade-up">
                <AlertCircle size={11} />
                <span className="font-medium">No recent updates</span>
              </div>
            )}
          </div>

          {error ? (
            <div
              className="rounded-3xl p-8 text-center fade-up backdrop-blur-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.4) 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.35), 0 10px 40px -12px rgba(239,68,68,0.3)',
              }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                <AlertCircle size={22} className="text-red-600" />
              </div>
              <p className="text-base font-semibold text-red-700 mb-1">Connection error</p>
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <p className="text-xs text-red-500">
                Verify your Firebase config in{' '}
                <code className="font-mono bg-red-100 px-1.5 py-0.5 rounded">.env.local</code> and
                that your Realtime Database rules allow reads.
              </p>
            </div>
          ) : loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-fr">
                <div className="fade-up h-full" style={{ animationDelay: '0ms' }}>
                  <SensorCard
                    title="Temperature"
                    value={temperature}
                    unit="°C"
                    history={tempHistory}
                    icon={<Thermometer size={16} className="text-blue-600" />}
                    accentHex="#3b82f6"
                    gradientId="temp-gradient"
                    decimals={1}
                    status={tempStatus}
                  />
                </div>
                <div className="fade-up h-full" style={{ animationDelay: '60ms' }}>
                  <SensorCard
                    title="Humidity"
                    value={humidity}
                    unit="%"
                    history={humidityHistory}
                    icon={<Droplets size={16} className="text-teal-600" />}
                    accentHex="#14b8a6"
                    gradientId="hum-gradient"
                    decimals={1}
                    status={humStatus}
                  />
                </div>
                <div className="fade-up h-full" style={{ animationDelay: '120ms' }}>
                  <GasCard value={gas} gasAlarm={gasAlarm} history={gasHistory} status={gStatus} />
                </div>
                <div className="fade-up h-full" style={{ animationDelay: '180ms' }}>
                  <LightCard lightOn={lightOn} />
                </div>
              </div>

              <div className="fade-up" style={{ animationDelay: '240ms' }}>
                <EventLog entries={logEntries} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
