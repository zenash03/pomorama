"use client"

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/80 text-sm font-medium">Focus Sessions</span>
        <span className="text-white font-semibold">
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
