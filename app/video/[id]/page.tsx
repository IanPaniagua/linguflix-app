'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Header from '@/components/Header'
import { Volume2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

type VideoData = {
  title: string
  description: string
  video: {
    type: 'youtube' | 'local'
    url: string
  }
  phrases: Array<{
    german: string
    spanish: string
    audio: string
  }>
  vocabulary: Array<{
    word: string
    article: string
    image: string
    audio: string
  }>
}

const VideoPlayer = React.memo(({ videoData }: { videoData: VideoData }) => {
  if (videoData.video.type === 'youtube') {
    let videoId = ''
    const url = videoData.video.url
    
    // Handle different YouTube URL formats
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1])
      videoId = urlParams.get('v') || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || ''
    }

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  } else {
    return (
      <video controls className="w-full h-full">
        <source src={videoData.video.url} type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
    )
  }
})
VideoPlayer.displayName = 'VideoPlayer'

function AudioButton({ audioUrl, small = false }: { audioUrl: string; small?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) {
    return (
      <button
        className={`${small ? 'p-1.5' : 'p-2'} rounded-full transition-colors hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80`}
      >
        <Volume2 className={`${small ? 'w-5 h-5' : 'w-6 h-6'}`} />
      </button>
    )
  }

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

export default function VideoPage() {
  const params = useParams()
  const id = params.id as string
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const docRef = doc(db, 'topics', id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data() as VideoData
          console.log('Fetched data:', data)
          setVideoData(data)
        }
      } catch (error) {
        console.error('Error fetching video data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideoData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-[url('/image/bg-universe.png')] bg-cover bg-center" />
        <div className="fixed inset-0 bg-black/60" />
        <div className="relative">
          <Header />
          <main className="container mx-auto px-4 pt-24">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[oklch(0.623_0.214_259.815)]"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!videoData) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-[url('/image/bg-universe.png')] bg-cover bg-center" />
        <div className="fixed inset-0 bg-black/60" />
        <div className="relative">
          <Header />
          <main className="container mx-auto px-4 pt-24">
            <h1 className="text-2xl font-bold text-[#E8E9EB] drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">Video no encontrado</h1>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-[url('/image/bg-universe.png')] bg-cover bg-center" />
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative">
        <Header />
        
        <main className="container mx-auto px-4 pt-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-sword drop-shadow-[var(--sword-glow)]">
              {videoData?.title}
            </h1>
          </div>
          
          {videoData && (
            <>
              <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <VideoPlayer videoData={videoData} />
              </div>

              <section className="mt-12 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-sword drop-shadow-[var(--sword-glow)]">
                  Now you can listen and repeat
                </h2>
                <div className="space-y-4">
                  {videoData.phrases.map((phrase, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/5 hover:bg-white/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-white">{phrase.german}</p>
                        {phrase.audio && phrase.audio.trim() !== '' && (
                          <AudioButton audioUrl={phrase.audio} />
                        )}
                      </div>
                      <p className="text-gray-300 mt-2">{phrase.spanish}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-12 max-w-4xl mx-auto pb-12">
                <h2 className="text-2xl font-bold mb-6 text-sword drop-shadow-[var(--sword-glow)]">Vocabulary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videoData.vocabulary.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 rounded-lg overflow-hidden border border-white/5 hover:bg-white/20 transition-colors"
                    >
                      {item.image && item.image.trim() !== '' && (
                        <div className="relative aspect-square bg-black/50">
                          <Image
                            src={item.image}
                            alt={item.word}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                            priority={index < 4}
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">
                            <span className="text-white/80">{item.article}</span> {item.word}
                          </p>
                          {item.audio && item.audio.trim() !== '' && (
                            <AudioButton audioUrl={item.audio} small />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
} 