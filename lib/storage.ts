export interface StorageData {
  tasks: Task[]
  preferences: UserPreferences
  timerStats: TimerStats
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface UserPreferences {
  wallpaperUrl: string
  focusReference: string
  theme: "light" | "dark"
  userName: string
  focusDuration: number // in seconds
  shortBreakDuration: number // in seconds
  longBreakDuration: number // in seconds
  autoStartBreak: boolean
  autoStartFocus: boolean
}

export interface TimerStats {
  totalFocusSessions: number
  totalBreakTime: number
}

const STORAGE_KEY = "pomodoro-app-data"

const defaultData: StorageData = {
  tasks: [],
  preferences: {
    wallpaperUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    focusReference: "Stay focused and productive",
    theme: "light",
    userName: "Friend",
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    autoStartBreak: false,
    autoStartFocus: false,
  },
  timerStats: {
    totalFocusSessions: 0,
    totalBreakTime: 0,
  },
}

export function getStorageData(): StorageData {
  if (typeof window === "undefined") return defaultData

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : defaultData
  } catch {
    return defaultData
  }
}

export function saveStorageData(data: StorageData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save data to localStorage:", error)
  }
}

export function addTask(text: string): Task {
  const data = getStorageData()
  const newTask: Task = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
  }
  data.tasks.push(newTask)
  saveStorageData(data)
  return newTask
}

export function toggleTask(taskId: string): void {
  const data = getStorageData()
  const task = data.tasks.find((t) => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    saveStorageData(data)
  }
}

export function deleteTask(taskId: string): void {
  const data = getStorageData()
  data.tasks = data.tasks.filter((t) => t.id !== taskId)
  saveStorageData(data)
}

export function updatePreferences(preferences: Partial<UserPreferences>): void {
  const data = getStorageData()
  data.preferences = { ...data.preferences, ...preferences }
  saveStorageData(data)
}

export function updateTimerStats(focusSessions: number, breakTime: number): void {
  const data = getStorageData()
  data.timerStats.totalFocusSessions += focusSessions
  data.timerStats.totalBreakTime += breakTime
  saveStorageData(data)
}
