"use client"

import { useEffect, useState, useCallback } from "react"
import { TimerDisplay } from "@/components/timer-display"
import { TaskManagement } from "@/components/task-management"
import { PreferencesPanel } from "@/components/preferences-panel"
import { usePomodoroTimer } from "@/hooks/use-pomodoro-timer"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { addTask, toggleTask, deleteTask, updatePreferences, updateTimerStats, getStorageData } from "@/lib/storage"
import { getRandomMotivationalMessage } from "@/lib/motivational-messages"

type ViewMode = "focus-only" | "tasks" | "all-focus"

export default function Page() {
  const { data, isLoaded, updateData } = useLocalStorage()
  const {
    timeRemaining,
    isRunning,
    mode,
    focusCount,
    durations,
    switchMode,
    toggleRunning,
    resetTimer,
    updateDurations,
    setAutoStart,
  } = usePomodoroTimer()
  const [prevFocusCount, setPrevFocusCount] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>("all-focus")
  const [motivationalMessage, setMotivationalMessage] = useState("")

  useEffect(() => {
    if (data?.preferences.userName) {
      setMotivationalMessage(getRandomMotivationalMessage(data.preferences.userName))
    }
  }, [data?.preferences.userName])

  // Track focus session completion for stats
  useEffect(() => {
    if (focusCount > prevFocusCount) {
      setPrevFocusCount(focusCount)
      if (data) {
        updateTimerStats(1, 0)
        // refresh local state from storage so the UI re-renders with updated stats
        try {
          const fresh = getStorageData()
          updateData(fresh)
        } catch (e) {
          console.error("Failed to refresh storage data after stats update:", e)
        }
      }
    }
  }, [focusCount, prevFocusCount, data])

  const handleAddTask = useCallback(
    (text: string) => {
      const newTask = addTask(text)
      if (data) {
        const updatedData = { ...data }
        updatedData.tasks.push(newTask)
        updateData(updatedData)
      }
    },
    [data, updateData],
  )

  const handleToggleTask = useCallback(
    (taskId: string) => {
      toggleTask(taskId)
      if (data) {
        const updatedData = { ...data }
        const task = updatedData.tasks.find((t) => t.id === taskId)
        if (task) {
          task.completed = !task.completed
        }
        updateData(updatedData)
      }
    },
    [data, updateData],
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId)
      if (data) {
        const updatedData = { ...data }
        updatedData.tasks = updatedData.tasks.filter((t) => t.id !== taskId)
        updateData(updatedData)
      }
    },
    [data, updateData],
  )

  const handleUpdatePreferences = useCallback(
    (prefs: any) => {
      updatePreferences(prefs)
      if (data) {
        const updatedData = { ...data }
        updatedData.preferences = { ...updatedData.preferences, ...prefs }
        updateData(updatedData)

        if (prefs.focusDuration || prefs.shortBreakDuration || prefs.longBreakDuration) {
          updateDurations({
            focus: prefs.focusDuration ?? durations.focus,
            shortBreak: prefs.shortBreakDuration ?? durations.shortBreak,
            longBreak: prefs.longBreakDuration ?? durations.longBreak,
          })
        }

        if (prefs.autoStartBreak !== undefined || prefs.autoStartFocus !== undefined) {
          setAutoStart({
            break: prefs.autoStartBreak ?? false,
            focus: prefs.autoStartFocus ?? false,
          })
        }
      }
    },
    [data, updateData, durations, updateDurations, setAutoStart],
  )

  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans transition-all duration-500"
      style={{
        backgroundImage: `url(${data.preferences.wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none" />

      <div className="relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Hello, {data.preferences.userName}
          </h1>
          <p className="mt-4 text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">{motivationalMessage}</p>
        </header>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setViewMode("focus-only")}
            className={`px-6 py-2 rounded-full font-semibold transition-all backdrop-blur-md border ${
              viewMode === "focus-only"
                ? "bg-white/30 text-white border-white/60 shadow-lg"
                : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
            }`}
          >
            Focus Only
          </button>
          <button
            onClick={() => setViewMode("tasks")}
            className={`px-6 py-2 rounded-full font-semibold transition-all backdrop-blur-md border ${
              viewMode === "tasks"
                ? "bg-white/30 text-white border-white/60 shadow-lg"
                : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setViewMode("all-focus")}
            className={`px-6 py-2 rounded-full font-semibold transition-all backdrop-blur-md border ${
              viewMode === "all-focus"
                ? "bg-white/30 text-white border-white/60 shadow-lg"
                : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
            }`}
          >
            All Focus
          </button>
        </div>

        <main className="max-w-6xl mx-auto">
          {/* Focus Only View */}
          {viewMode === "focus-only" && (
            <div className="flex justify-center">
              <TimerDisplay
                timeRemaining={timeRemaining}
                isRunning={isRunning}
                mode={mode}
                focusCount={focusCount}
                onToggleRunning={toggleRunning}
                onResetTimer={resetTimer}
                onSwitchMode={switchMode}
                durations={durations}
              />
            </div>
          )}

          {/* Tasks Only View */}
          {viewMode === "tasks" && (
            <div className="flex justify-center">
              <TaskManagement
                tasks={data.tasks}
                onAddTask={handleAddTask}
                onToggleCompleted={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {/* All Focus View - Timer and Tasks Side by Side */}
          {viewMode === "all-focus" && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="lg:w-1/2 flex justify-center">
                <TimerDisplay
                  timeRemaining={timeRemaining}
                  isRunning={isRunning}
                  mode={mode}
                  focusCount={focusCount}
                  onToggleRunning={toggleRunning}
                  onResetTimer={resetTimer}
                  onSwitchMode={switchMode}
                  durations={durations}
                />
              </div>

              <div className="lg:w-1/2">
                <TaskManagement
                  tasks={data.tasks}
                  onAddTask={handleAddTask}
                  onToggleCompleted={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </div>
          )}
        </main>

        {/* Stats Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-block backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
            <p className="text-white/80 text-sm">
              Total Focus Sessions: <span className="font-bold text-white">{data.timerStats.totalFocusSessions}</span>
            </p>
          </div>
        </footer>

        {/* Preferences Panel */}
        <PreferencesPanel preferences={data.preferences} onUpdate={handleUpdatePreferences} />
      </div>
    </div>
  )
}
