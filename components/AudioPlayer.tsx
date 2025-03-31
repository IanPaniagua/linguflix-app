'use client'

import { useState, useEffect } from 'react'
import { Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  small?: boolean
}

export default function AudioPlayer({ audioUrl, small = false }: AudioPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audioElement = new Audio()
    audioElement.addEventListener('ended', () => setIsPlaying(false))
    audioElement.addEventListener('error', () => setIsPlaying(false))
    setAudio(audioElement)

    return () => {
      audioElement.removeEventListener('ended', () => setIsPlaying(false))
      audioElement.removeEventListener('error', () => setIsPlaying(false))
      audioElement.pause()
    }
  }, [])

  const toggleAudio = async () => {
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.src = audioUrl
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  return (
    <button
      onClick={toggleAudio}
      className={`${small ? 'p-1.5' : 'p-2'} rounded-full transition-colors ${
        isPlaying 
          ? 'bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]' 
          : 'hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80'
      }`}
      title={isPlaying ? "Stop audio" : "Play audio"}
    >
      <Volume2 className={`${small ? 'w-5 h-5' : 'w-6 h-6'}`} />
    </button>
  )
} 