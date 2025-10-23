"use client"

import { useState, useEffect, useCallback } from "react"
import { playBeep, type PomodoroMode } from "@/lib/podomoro-utils"
import { getStorageData } from "@/lib/storage"

export function usePomodoroTimer() {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<PomodoroMode>("focus")
  const [focusCount, setFocusCount] = useState(0)
  const [durations, setDurations] = useState<Record<PomodoroMode, number>>({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  })
  const [autoStart, setAutoStart] = useState({ break: false, focus: false })

  useEffect(() => {
    const data = getStorageData()
    const newDurations: Record<PomodoroMode, number> = {
      focus: data.preferences.focusDuration,
      shortBreak: data.preferences.shortBreakDuration,
      longBreak: data.preferences.longBreakDuration,
    }
    setDurations(newDurations)
    setAutoStart({
      break: data.preferences.autoStartBreak,
      focus: data.preferences.autoStartFocus,
    })
    setTimeRemaining(newDurations.focus)
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      playBeep(880, 500, 0.7)

      let nextMode: PomodoroMode
      let newFocusCount = focusCount

      if (mode === "focus") {
        newFocusCount += 1
        setFocusCount(newFocusCount)

        if (newFocusCount % 4 === 0) {
          nextMode = "longBreak"
        } else {
          nextMode = "shortBreak"
        }
      } else {
        nextMode = "focus"
      }

      setMode(nextMode)
      setTimeRemaining(durations[nextMode])

      if ((nextMode === "focus" && autoStart.focus) || (nextMode !== "focus" && autoStart.break)) {
        setIsRunning(true)
      } else {
        setIsRunning(false)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, mode, focusCount, durations, autoStart])

  const switchMode = useCallback(
    (newMode: PomodoroMode) => {
      setIsRunning(false)
      setMode(newMode)
      setTimeRemaining(durations[newMode])
    },
    [durations],
  )

  const toggleRunning = () => {
    if (!isRunning && timeRemaining === 0) {
      setTimeRemaining(durations[mode])
    }
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(durations[mode])
  }

  const updateDurations = useCallback(
    (newDurations: Record<PomodoroMode, number>) => {
      setDurations(newDurations)
      setTimeRemaining(newDurations[mode])
    },
    [mode],
  )

  return {
    timeRemaining,
    isRunning,
    mode,
    focusCount,
    durations,
    autoStart,
    switchMode,
    toggleRunning,
    resetTimer,
    updateDurations,
    setAutoStart,
  }
}
