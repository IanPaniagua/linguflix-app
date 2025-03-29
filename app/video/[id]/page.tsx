'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Header from '@/components/Header'
import { Volume2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

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

export default function VideoPage() {
  const params = useParams()
  const id = params.id as string
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const audioElement = new Audio()
    audioElement.addEventListener('ended', () => setIsPlaying(null))
    audioElement.addEventListener('error', (e) => {
      console.error('Error playing audio:', e)
      setIsPlaying(null)
    })
    setAudio(audioElement)

    return () => {
      audioElement.removeEventListener('ended', () => setIsPlaying(null))
      audioElement.removeEventListener('error', () => setIsPlaying(null))
      audioElement.pause()
    }
  }, [])

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

  const playAudio = async (audioUrl: string) => {
    try {
      if (!audio) return

      if (isPlaying === audioUrl) {
        audio.pause()
        setIsPlaying(null)
        return
      }
      
      console.log('Playing audio:', audioUrl) // Debug log
      setIsPlaying(audioUrl)
      audio.src = audioUrl
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl font-bold text-primary">Video no encontrado</h1>
        </main>
      </div>
    )
  }

  const VideoPlayer = () => {
    if (videoData.video.type === 'youtube') {
      const videoId = videoData.video.url.split('v=')[1]?.split('&')[0] || ''
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Video Player Section */}
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-primary">{videoData.title}</h1>
        </div>
        <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
          <VideoPlayer />
        </div>

        {/* Listen & Repeat Section */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-primary/90">Escucha y Repite</h2>
          <div className="space-y-4">
            {videoData.phrases.map((phrase, index) => (
              <div 
                key={index} 
                className="bg-secondary/50 p-4 rounded-lg border border-white/5 hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-primary">{phrase.german}</p>
                  {phrase.audio && phrase.audio.trim() !== '' && (
                    <button
                      onClick={() => playAudio(phrase.audio)}
                      className={`p-2 rounded-full transition-colors ${
                        isPlaying === phrase.audio 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-primary/20 text-primary/80'
                      }`}
                      title={isPlaying === phrase.audio ? "Stop audio" : "Play audio"}
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
                <p className="text-gray-400 mt-2">{phrase.spanish}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vocabulary Section */}
        <section className="mt-12 max-w-4xl mx-auto pb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary/90">Vocabulario</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videoData.vocabulary.map((item, index) => (
              <div 
                key={index} 
                className="bg-secondary/50 rounded-lg overflow-hidden border border-white/5 hover:bg-secondary/80 transition-colors"
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
                    <p className="font-medium text-primary">
                      <span className="text-primary/80">{item.article}</span> {item.word}
                    </p>
                    {item.audio && item.audio.trim() !== '' && (
                      <button
                        onClick={() => playAudio(item.audio)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isPlaying === item.audio 
                            ? 'bg-primary/20 text-primary' 
                            : 'hover:bg-primary/20 text-primary/80'
                        }`}
                        title={isPlaying === item.audio ? "Stop audio" : "Play audio"}
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
      </main>
    </div>
  )
} 