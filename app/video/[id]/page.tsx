'use client'

import { useEffect, useState, useCallback } from 'react'
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

const PhraseItem = React.memo(({ 
  phrase, 
  isPlaying, 
  onPlayClick 
}: { 
  phrase: VideoData['phrases'][0],
  isPlaying: boolean,
  onPlayClick: () => void
}) => {
  return (
    <div className="bg-white/10 p-4 rounded-lg border border-white/5 hover:bg-white/20 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium text-white">{phrase.german}</p>
        {phrase.audio && phrase.audio.trim() !== '' && (
          <button
            onClick={onPlayClick}
            className={`p-2 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]' 
                : 'hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80'
            }`}
            title={isPlaying ? "Stop audio" : "Play audio"}
          >
            <Volume2 className="w-6 h-6" />
          </button>
        )}
      </div>
      <p className="text-gray-300 mt-2">{phrase.spanish}</p>
    </div>
  )
})

export default function VideoPage() {
  const params = useParams()
  const id = params.id as string
  const [audio] = useState(() => new Audio())
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAudioEnd = () => setPlayingAudioUrl(null)
    const handleAudioError = () => setPlayingAudioUrl(null)
    
    audio.addEventListener('ended', handleAudioEnd)
    audio.addEventListener('error', handleAudioError)

    return () => {
      audio.removeEventListener('ended', handleAudioEnd)
      audio.removeEventListener('error', handleAudioError)
      audio.pause()
    }
  }, [audio])

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const docRef = doc(db, 'topics', id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data() as VideoData
          console.log('Fetched data:', data) // Debug log
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

  const playAudio = useCallback(async (audioUrl: string) => {
    try {
      if (playingAudioUrl === audioUrl) {
        audio.pause()
        setPlayingAudioUrl(null)
        return
      }
      
      setPlayingAudioUrl(audioUrl)
      audio.src = audioUrl
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setPlayingAudioUrl(null)
    }
  }, [audio, playingAudioUrl])

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
                  Escucha y Repite
                </h2>
                <div className="space-y-4">
                  {videoData.phrases.map((phrase, index) => (
                    <PhraseItem
                      key={index}
                      phrase={phrase}
                      isPlaying={playingAudioUrl === phrase.audio}
                      onPlayClick={() => playAudio(phrase.audio)}
                    />
                  ))}
                </div>
              </section>

              {/* Vocabulary Section */}
              <section className="mt-12 max-w-4xl mx-auto pb-12">
                <h2 className="text-2xl font-bold mb-6 text-sword drop-shadow-[var(--sword-glow)]">Vocabulario</h2>
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
                            <button
                              onClick={() => playAudio(item.audio)}
                              className={`p-1.5 rounded-full transition-colors ${
                                playingAudioUrl === item.audio 
                                  ? 'bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]' 
                                  : 'hover:bg-[oklch(0.623_0.214_259.815)]/20 text-[oklch(0.623_0.214_259.815)]/80'
                              }`}
                              title={playingAudioUrl === item.audio ? "Stop audio" : "Play audio"}
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
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