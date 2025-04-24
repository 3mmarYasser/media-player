"use client"

import { useState, useEffect } from "react"

export interface VideoProgress {
  id: string
  progress: number // 0 to 1
  watched: boolean
  lastPosition: number // in seconds
}

export function useVideoProgress() {
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({})

  // Load progress from localStorage on initial render
  useEffect(() => {
    const savedProgress = localStorage.getItem("videoProgress")
    if (savedProgress) {
      try {
        setVideoProgress(JSON.parse(savedProgress))
      } catch (e) {
        console.error("Failed to parse saved video progress", e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(videoProgress).length > 0) {
      localStorage.setItem("videoProgress", JSON.stringify(videoProgress))
    }
  }, [videoProgress])

  const updateProgress = (videoId: string, currentTime: number, duration: number) => {
    const progress = duration > 0 ? currentTime / duration : 0
    const watched = progress >= 0.8 // Mark as watched when 80% complete

    setVideoProgress((prev) => ({
      ...prev,
      [videoId]: {
        id: videoId,
        progress,
        watched,
        lastPosition: currentTime,
      },
    }))
  }

  const getVideoProgress = (videoId: string): VideoProgress => {
    return (
      videoProgress[videoId] || {
        id: videoId,
        progress: 0,
        watched: false,
        lastPosition: 0,
      }
    )
  }

  return {
    videoProgress,
    updateProgress,
    getVideoProgress,
  }
} 