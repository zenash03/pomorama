"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import type { UserPreferences } from "@/lib/storage"

interface PreferencesPanelProps {
  preferences: UserPreferences
  onUpdate: (preferences: Partial<UserPreferences>) => void
}

export function PreferencesPanel({ preferences, onUpdate }: PreferencesPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [wallpaperUrl, setWallpaperUrl] = useState(preferences.wallpaperUrl)
  const [focusReference, setFocusReference] = useState(preferences.focusReference)
  const [userName, setUserName] = useState(preferences.userName)
  const [focusDuration, setFocusDuration] = useState(preferences.focusDuration / 60)
  const [shortBreakDuration, setShortBreakDuration] = useState(preferences.shortBreakDuration / 60)
  const [longBreakDuration, setLongBreakDuration] = useState(preferences.longBreakDuration / 60)
  const [autoStartBreak, setAutoStartBreak] = useState(preferences.autoStartBreak)
  const [autoStartFocus, setAutoStartFocus] = useState(preferences.autoStartFocus)

  const handleSave = () => {
    onUpdate({
      wallpaperUrl,
      focusReference,
      userName,
      focusDuration: focusDuration * 60,
      shortBreakDuration: shortBreakDuration * 60,
      longBreakDuration: longBreakDuration * 60,
      autoStartBreak,
      autoStartFocus,
    })
    setIsOpen(false)
  }

  const wallpaperPresets = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1761165308046-174a56e73525?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1760648149145-560e619098ef?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=800&fit=crop",
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 transition duration-200 backdrop-blur-md border border-white/30 z-40"
        aria-label="Open Settings"
      >
        <Settings size={24} color="white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-md w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Preferences</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition">
                <X size={24} color="white" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-white font-semibold mb-3">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-white font-semibold mb-4">Timer Durations</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Focus Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={focusDuration}
                      onChange={(e) => setFocusDuration(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Short Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakDuration}
                      onChange={(e) => setShortBreakDuration(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Long Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakDuration}
                      onChange={(e) => setLongBreakDuration(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-white font-semibold mb-4">Auto-Start</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoStartBreak}
                      onChange={(e) => setAutoStartBreak(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white/80">Auto-start break when focus ends</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoStartFocus}
                      onChange={(e) => setAutoStartFocus(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white/80">Auto-start focus after break</span>
                  </label>
                </div>
              </div>

              {/* Wallpaper Selection */}
              <div className="border-t border-white/20 pt-4">
                <label className="block text-white font-semibold mb-3">Wallpaper</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {wallpaperPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setWallpaperUrl(preset)}
                      className={`h-16 rounded-lg overflow-hidden border-2 transition ${
                        wallpaperUrl === preset ? "border-white/80" : "border-white/20 hover:border-white/40"
                      }`}
                      style={{
                        backgroundImage: `url(${preset})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={wallpaperUrl}
                  onChange={(e) => setWallpaperUrl(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Focus Reference */}
              <div>
                <label className="block text-white font-semibold mb-3">Focus Reference</label>
                <textarea
                  value={focusReference}
                  onChange={(e) => setFocusReference(e.target.value)}
                  placeholder="Add a personal motivation or focus reminder..."
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none h-24"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full py-3 bg-white/30 text-white font-semibold rounded-lg hover:bg-white/40 transition duration-200 border border-white/40"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
