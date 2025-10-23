export const POMODORO_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export const LONG_BREAK_INTERVAL = 4

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}

export function playBeep(freq = 440, duration = 200, volume = 0.5) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    gainNode.gain.value = volume
    oscillator.frequency.value = freq
    oscillator.type = "sine"

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + duration / 1000)
  } catch (error) {
    console.error("Failed to play beep:", error)
  }
}

export type PomodoroMode = "focus" | "shortBreak" | "longBreak"

export interface ModeDetails {
  name: string
  color: string
  glassColor: string
  icon: string
}

export function getModeDetails(mode: PomodoroMode): ModeDetails {
  switch (mode) {
    case "focus":
      return {
        name: "Focus",
        color: "bg-red-500",
        glassColor: "shadow-red-500/20",
        icon: "Zap",
      }
    case "shortBreak":
      return {
        name: "Short Break",
        color: "bg-emerald-500",
        glassColor: "shadow-emerald-500/20",
        icon: "Coffee",
      }
    case "longBreak":
      return {
        name: "Long Break",
        color: "bg-sky-500",
        glassColor: "shadow-sky-500/20",
        icon: "Hourglass",
      }
    default:
      return {
        name: "Pomodoro",
        color: "bg-gray-500",
        glassColor: "shadow-gray-500/20",
        icon: "Clock",
      }
  }
}
