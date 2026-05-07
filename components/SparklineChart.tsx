'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  data: number[]
  color: string
  gradientId: string
}

export default function SparklineChart({ data, color, gradientId }: Props) {
  const chartData = data.map((v, i) => ({ i, v }))

  if (chartData.length < 2) {
    return (
      <div className="h-14 flex items-center justify-center">
        <p className="text-[11px] text-slate-300">Waiting for data…</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: color }}
          isAnimationActive={false}
        />
        <Tooltip
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const val = Number(payload[0].value)
            return (
              <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-md font-medium tabular-nums">
                {Number.isInteger(val) ? val : val.toFixed(1)}
              </div>
            )
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
