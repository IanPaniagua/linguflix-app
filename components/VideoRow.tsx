'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  level: string
  duration: string
}

interface VideoRowProps {
  title: string
  videos: Video[]
}

export default function VideoRow({ title, videos }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white px-4">{title}</h2>
      <div className="relative group">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-hidden px-4 scroll-smooth"
        >
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="flex-none w-72 transform transition-transform hover:scale-105 cursor-pointer"
            >
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={384}
                  height={216}
                  className="w-full h-full object-cover transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                  priority={parseInt(video.id) <= 4}
                  quality={85}
                  loading={parseInt(video.id) <= 4 ? 'eager' : 'lazy'}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">{video.title}</h3>
                </div>
                <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 text-center">
                  <h3 className="font-bold text-white mb-2">{video.title}</h3>
                  <p className="text-sm text-white/90 mb-3 line-clamp-3">{video.description}</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-primary/80 px-2 py-1 rounded text-white">
                      {video.level}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                      {video.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
} 