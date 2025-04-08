'use client'

import { useState, useRef } from 'react'
import { Mic, Play, Square, RotateCcw } from 'lucide-react'

interface VoiceRecorderProps {
  onRecordingComplete?: (blob: Blob) => void
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }
        setHasRecording(true)
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.src = ''
    }
    setHasRecording(false)
    setIsPlaying(false)
  }

  return (
    <div className="flex items-center gap-2">
      {!hasRecording ? (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
              : 'hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80'
          }`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      ) : (
        <>
          <button
            onClick={playRecording}
            className={`p-2 rounded-full transition-colors ${
              isPlaying
                ? 'bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]'
                : 'hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80'
            }`}
            title="Play recording"
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={resetRecording}
            className="p-2 rounded-full transition-colors hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80"
            title="Record again"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </>
      )}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
} 