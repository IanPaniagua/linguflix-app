'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Volume2 } from 'lucide-react'
import Image from 'next/image'

type VideoData = {
  [key: string]: {
    title: string
    video: string
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
}

// Datos de ejemplo para el video del restaurante
const videoData: VideoData = {
  '1': {
    title: 'En el Restaurante',
    video: '/Restaurant_Scene.mp4',
    phrases: [
      {
        german: "Einen Tisch für zwei Personen, bitte",
        spanish: "Una mesa para dos personas, por favor",
        audio: "/audio/tisch-fur-zwei.mp3"
      },
      {
        german: "Die Speisekarte, bitte",
        spanish: "La carta, por favor",
        audio: "/audio/speisekarte.mp3"
      },
      {
        german: "Ich möchte bestellen",
        spanish: "Me gustaría pedir",
        audio: "/audio/bestellen.mp3"
      }
    ],
    vocabulary: [
      {
        word: "Restaurant",
        article: "das",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&h=300&q=80",
        audio: "/audio/restaurant.mp3"
      },
      {
        word: "Tisch",
        article: "der",
        image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=300&h=300&q=80",
        audio: "/audio/tisch.mp3"
      },
      {
        word: "Speisekarte",
        article: "die",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=300&h=300&q=80",
        audio: "/audio/speisekarte.mp3"
      },
      {
        word: "Kellner",
        article: "der",
        image: "https://images.unsplash.com/photo-1516788875874-c5912cae7b43?auto=format&fit=crop&w=300&h=300&q=80",
        audio: "/audio/kellner.mp3"
      }
    ]
  }
}

export default function VideoPage({ params }: { params: { id: string } }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const videoInfo = videoData[params.id as keyof typeof videoData]

  useEffect(() => {
    setAudio(new Audio())
  }, [])

  const playAudio = (audioUrl: string) => {
    if (audio) {
      audio.src = audioUrl
      audio.play()
    }
  }

  if (!videoInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl font-bold">Video no encontrado</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Video Player Section */}
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-primary">{videoInfo.title}</h1>
        </div>
        <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
          <video
            controls
            className="w-full h-full"
            autoPlay
          >
            <source src={videoInfo.video} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>

        {/* Listen & Repeat Section */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-primary/90">Escucha y Repite</h2>
          <div className="space-y-4">
            {videoInfo.phrases.map((phrase, index) => (
              <div 
                key={index} 
                className="bg-secondary/50 p-4 rounded-lg border border-white/5 hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-primary">{phrase.german}</p>
                  <button
                    onClick={() => playAudio(phrase.audio)}
                    className="p-2 hover:bg-primary/20 rounded-full transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-primary" />
                  </button>
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
            {videoInfo.vocabulary.map((item, index) => (
              <div 
                key={index} 
                className="bg-secondary/50 rounded-lg overflow-hidden border border-white/5 hover:bg-secondary/80 transition-colors"
              >
                <div className="relative aspect-square bg-black/50">
                  <Image
                    src={item.image}
                    alt={item.word}
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    priority={index < 4}
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-primary">
                      <span className="text-primary">{item.article}</span> {item.word}
                    </p>
                    <button
                      onClick={() => playAudio(item.audio)}
                      className="p-1.5 hover:bg-primary/20 rounded-full transition-colors"
                    >
                      <Volume2 className="w-5 h-5 text-primary" />
                    </button>
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