"use client"

import { useState, useEffect, useCallback } from "react"
import { getStorageData, saveStorageData, type StorageData } from "@/lib/storage"

export function useLocalStorage() {
  const [data, setData] = useState<StorageData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storageData = getStorageData()
    setData(storageData)
    setIsLoaded(true)
  }, [])

  const updateData = useCallback((newData: StorageData) => {
    setData(newData)
    saveStorageData(newData)
  }, [])

  return { data, isLoaded, updateData }
}
