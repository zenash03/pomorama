"use client"

import type React from "react"
import { Play, Pause, RotateCcw, Zap, Coffee, Hourglass } from "lucide-react"
import { formatTime, getModeDetails, type PomodoroMode } from "@/lib/podomoro-utils"
import { ProgressBar } from "./progress-bar"

interface TimerDisplayProps {
  timeRemaining: number
  isRunning: boolean
  mode: PomodoroMode
  focusCount: number
  onToggleRunning: () => void
  onResetTimer: () => void
  onSwitchMode: (mode: PomodoroMode) => void
  durations: { focus: number; shortBreak: number; longBreak: number }
}

const modeIcons: Record<PomodoroMode, React.ReactNode> = {
  focus: <Zap className="w-5 h-5" color="white" />,
  shortBreak: <Coffee className="w-5 h-5" color="white" />,
  longBreak: <Hourglass className="w-5 h-5" color="white" />,
}

export function TimerDisplay({
  timeRemaining,
  isRunning,
  mode,
  focusCount,
  onToggleRunning,
  onResetTimer,
  onSwitchMode,
  durations,
}: TimerDisplayProps) {
  const modeDetail = getModeDetails(mode)
  const focusMinutes = Math.round(durations.focus / 60)
  const shortBreakMinutes = Math.round(durations.shortBreak / 60)
  const longBreakMinutes = Math.round(durations.longBreak / 60)

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className={`relative p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-500 w-full max-w-sm
          backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30
          ${modeDetail.glassColor}`}
      >
        <div className="flex justify-center items-center mb-6">
          {modeIcons[mode]}
          <h2 className="text-2xl font-semibold ml-2 text-white">{modeDetail.name}</h2>
        </div>

        <div className="text-8xl font-extrabold text-center tracking-tighter mb-8 text-white drop-shadow-lg">
          {formatTime(timeRemaining)}
        </div>

        <div className="mb-6 px-2">
          <ProgressBar current={focusCount % 4} total={4} />
        </div>

        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
          <button
            onClick={() => onSwitchMode("focus")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all backdrop-blur-sm ${
              mode === "focus"
                ? "bg-white/40 text-white border border-white/60"
                : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
            }`}
          >
            Focus ({focusMinutes}m)
          </button>
          <button
            onClick={() => onSwitchMode("shortBreak")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all backdrop-blur-sm ${
              mode === "shortBreak"
                ? "bg-white/40 text-white border border-white/60"
                : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
            }`}
          >
            Short Break ({shortBreakMinutes}m)
          </button>
          <button
            onClick={() => onSwitchMode("longBreak")}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all backdrop-blur-sm ${
              mode === "longBreak"
                ? "bg-white/40 text-white border border-white/60"
                : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
            }`}
          >
            Long Break ({longBreakMinutes}m)
          </button>
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={onToggleRunning}
            className="flex items-center justify-center p-4 bg-white/30 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-white/40 transform hover:scale-105 transition duration-200 backdrop-blur-sm border border-white/40"
            aria-label={isRunning ? "Pause Timer" : "Start Timer"}
          >
            {isRunning ? <Pause size={28} fill="white" color="white" /> : <Play size={28} fill="white" color="white" />}
          </button>
          <button
            onClick={onResetTimer}
            className="flex items-center justify-center p-4 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 transition duration-200 backdrop-blur-sm border border-white/30"
            aria-label="Reset Timer"
          >
            <RotateCcw size={28} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
