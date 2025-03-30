'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

interface Topic {
  id: string
  title: string
  description: string
  level: 'basic' | 'intermediate' | 'advanced'
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

function VideoRow({ title, topics }: { title: string; topics: Topic[] }) {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 text-white">
          {topics.map((topic, index) => (
            <Link 
              key={topic.id} 
              href={`/video/${topic.id}`}
              className="flex-none w-72 group"
            >
              <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <Image
                  src={topic.vocabulary[0]?.image || 'https://images.unsplash.com/photo-1557223562-6c77ef16210f'}
                  alt={topic.title}
                  width={384}
                  height={216}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={index < 4}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-medium text-white">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsCollection = collection(db, 'topics')
        const topicsSnapshot = await getDocs(topicsCollection)
        const topicsList = topicsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Topic[]
        setTopics(topicsList)
      } catch (error) {
        console.error('Error fetching topics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  const basicTopics = topics.filter(topic => topic.level === 'basic')
  const intermediateTopics = topics.filter(topic => topic.level === 'intermediate')
  const advancedTopics = topics.filter(topic => topic.level === 'advanced')

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[url('/image/bg-universe.png')] bg-cover bg-center" />
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative">
        <Header />
      
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/video/Earth_countries.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent backdrop-blur-[2px]" />
          </div>
          
          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Learn languages <br />
                through Immersive <br />
                Videos
              </h1>
              {/* <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Master German naturally with our curated collection of real-life scenario videos,
                perfect for every skill level.
              </p> */}
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Learning
              </Button>
            </div>
          </div>
        </section>

        {/* Video Sections */}
        <main className="flex-1 w-full">
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : (
              <>
                {basicTopics.length > 0 && (
                  <VideoRow title="Basic Level - Start Your Journey" topics={basicTopics} />
                )}
                {intermediateTopics.length > 0 && (
                  <VideoRow title="Intermediate Level - Build Confidence" topics={intermediateTopics} />
                )}
                {advancedTopics.length > 0 && (
                  <VideoRow title="Advanced Level - Master German" topics={advancedTopics} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
