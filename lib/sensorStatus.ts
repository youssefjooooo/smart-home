export type Status = 'normal' | 'warning' | 'critical'

export interface StatusInfo {
  status: Status
  label: string | null
}

const NORMAL: StatusInfo = { status: 'normal', label: null }

export function temperatureStatus(value: number | null): StatusInfo {
  if (value === null) return NORMAL
  if (value < 5) return { status: 'critical', label: 'Freezing' }
  if (value > 38) return { status: 'critical', label: 'Critical' }
  if (value < 15) return { status: 'warning', label: 'Cold' }
  if (value > 30) return { status: 'warning', label: 'Hot' }
  return NORMAL
}

export function humidityStatus(value: number | null): StatusInfo {
  if (value === null) return NORMAL
  if (value < 20) return { status: 'critical', label: 'Very dry' }
  if (value > 85) return { status: 'critical', label: 'Saturated' }
  if (value < 30) return { status: 'warning', label: 'Dry' }
  if (value > 70) return { status: 'warning', label: 'Humid' }
  return NORMAL
}

export function gasStatus(value: number | null, alarm: boolean): StatusInfo {
  if (alarm) return { status: 'critical', label: 'Leak detected' }
  if (value === null) return NORMAL
  if (value > 400) return { status: 'warning', label: 'High' }
  if (value > 200) return { status: 'warning', label: 'Elevated' }
  return NORMAL
}

export const statusBadgeClass: Record<Status, string> = {
  normal: 'hidden',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}
