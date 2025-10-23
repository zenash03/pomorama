"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Plus, Trash2 } from "lucide-react"
import type { Task } from "@/lib/storage"

interface TaskManagementProps {
  tasks: Task[]
  onAddTask: (text: string) => void
  onToggleCompleted: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskManagement({ tasks, onAddTask, onToggleCompleted, onDeleteTask }: TaskManagementProps) {
  const [newTask, setNewTask] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAddTask(newTask)
      setNewTask("")
    }
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center drop-shadow-lg">
        <CheckCircle className="w-6 h-6 mr-2" />
        Your Tasks
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex mb-6 rounded-xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-lg"
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-4 text-white placeholder-white/50 focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-6 bg-white/20 text-white hover:bg-white/30 transition duration-150 flex items-center justify-center border-l border-white/20"
          aria-label="Add Task"
        >
          <Plus size={24} />
        </button>
      </form>

      {!activeTasks.length && !completedTasks.length && (
        <p className="text-center text-white/60 py-8 italic">No tasks yet. Add one to get started!</p>
      )}

      <div className="space-y-3">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition duration-150 shadow-lg"
          >
            <div className="flex items-center flex-grow">
              <button
                onClick={() => onToggleCompleted(task.id)}
                className="mr-3 text-white/70 hover:text-white transition"
                aria-label="Mark Complete"
              >
                <Circle size={24} />
              </button>
              <span className="text-lg text-white">{task.text}</span>
            </div>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="ml-4 text-white/50 hover:text-white/80 transition"
              aria-label="Delete Task"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8 border-t border-white/20 pt-4">
          <h3 className="text-xl font-semibold text-white/80 mb-4">Completed ({completedTasks.length})</h3>
          <div className="space-y-3 opacity-60">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg"
              >
                <div className="flex items-center flex-grow">
                  <button
                    onClick={() => onToggleCompleted(task.id)}
                    className="mr-3 text-white/50 hover:text-white/70 transition"
                    aria-label="Mark Incomplete"
                  >
                    <CheckCircle size={24} fill="currentColor" />
                  </button>
                  <span className="text-lg text-white/60 line-through">{task.text}</span>
                </div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="ml-4 text-white/30 hover:text-white/60 transition"
                  aria-label="Delete Task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
