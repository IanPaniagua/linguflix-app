'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { PlusCircle, X, Save } from 'lucide-react'

interface TopicData {
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

const emptyTopic: TopicData = {
  title: '',
  description: '',
  level: 'basic',
  video: {
    type: 'youtube',
    url: ''
  },
  phrases: [],
  vocabulary: []
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === 'new'
  const [topic, setTopic] = useState<TopicData>(emptyTopic)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      fetchTopic()
    }
  }, [isNew])

  const fetchTopic = async () => {
    try {
      const topicDoc = await getDoc(doc(db, 'topics', params.id))
      if (topicDoc.exists()) {
        setTopic(topicDoc.data() as TopicData)
      }
    } catch (error) {
      console.error('Error fetching topic:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isNew) {
        const docRef = doc(collection(db, 'topics'))
        await setDoc(docRef, {...topic} as any)
      } else {
        await updateDoc(doc(db, 'topics', params.id), {...topic} as any)
      }
      router.push('/admin')
    } catch (error) {
      console.error('Error saving topic:', error)
    }
  }

  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    try {
      const storageRef = ref(storage, `${type}s/${file.name}`)
      await uploadBytes(storageRef, file)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Error uploading file:', error)
      return ''
    }
  }

  const addPhrase = () => {
    setTopic({
      ...topic,
      phrases: [...topic.phrases, { german: '', spanish: '', audio: '' }]
    })
  }

  const updatePhrase = (index: number, field: keyof typeof topic.phrases[0], value: string) => {
    const newPhrases = [...topic.phrases]
    newPhrases[index] = { ...newPhrases[index], [field]: value }
    setTopic({ ...topic, phrases: newPhrases })
  }

  const removePhrase = (index: number) => {
    setTopic({
      ...topic,
      phrases: topic.phrases.filter((_, i) => i !== index)
    })
  }

  const addVocabulary = () => {
    setTopic({
      ...topic,
      vocabulary: [...topic.vocabulary, { word: '', article: '', image: '', audio: '' }]
    })
  }

  const updateVocabulary = (index: number, field: keyof typeof topic.vocabulary[0], value: string) => {
    const newVocabulary = [...topic.vocabulary]
    newVocabulary[index] = { ...newVocabulary[index], [field]: value }
    setTopic({ ...topic, vocabulary: newVocabulary })
  }

  const removeVocabulary = (index: number) => {
    setTopic({
      ...topic,
      vocabulary: topic.vocabulary.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          {isNew ? 'Create New Topic' : 'Edit Topic'}
        </h1>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Topic
        </button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={topic.title}
            onChange={(e) => setTopic({ ...topic, title: e.target.value })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={topic.description}
            onChange={(e) => setTopic({ ...topic, description: e.target.value })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={topic.level}
            onChange={(e) => setTopic({ ...topic, level: e.target.value as TopicData['level'] })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
            required
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Video Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Video</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={topic.video.type}
              onChange={(e) => setTopic({
                ...topic,
                video: { ...topic.video, type: e.target.value as 'youtube' | 'local' }
              })}
              className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
            >
              <option value="youtube">YouTube</option>
              <option value="local">Local File</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={topic.video.url}
              onChange={(e) => setTopic({
                ...topic,
                video: { ...topic.video, url: e.target.value }
              })}
              className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
              required
            />
          </div>
        </div>
      </div>

      {/* Phrases Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Phrases</h2>
          <button
            type="button"
            onClick={addPhrase}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Phrase
          </button>
        </div>
        <div className="space-y-4">
          {topic.phrases.map((phrase, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-start bg-secondary/30 p-4 rounded-lg relative">
              <button
                type="button"
                onClick={() => removePhrase(index)}
                className="absolute top-2 right-2 p-1 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <label className="block text-sm font-medium mb-1">German</label>
                <input
                  type="text"
                  value={phrase.german}
                  onChange={(e) => updatePhrase(index, 'german', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spanish</label>
                <input
                  type="text"
                  value={phrase.spanish}
                  onChange={(e) => updatePhrase(index, 'spanish', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleFileUpload(file, 'audio')
                      updatePhrase(index, 'audio', url)
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                />
                {phrase.audio && (
                  <audio controls className="mt-2 w-full">
                    <source src={phrase.audio} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Vocabulary</h2>
          <button
            type="button"
            onClick={addVocabulary}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Word
          </button>
        </div>
        <div className="space-y-4">
          {topic.vocabulary.map((word, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-start bg-secondary/30 p-4 rounded-lg relative">
              <button
                type="button"
                onClick={() => removeVocabulary(index)}
                className="absolute top-2 right-2 p-1 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <label className="block text-sm font-medium mb-1">Word</label>
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => updateVocabulary(index, 'word', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Article</label>
                <select
                  value={word.article}
                  onChange={(e) => updateVocabulary(index, 'article', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                  required
                >
                  <option value="">Select...</option>
                  <option value="der">der</option>
                  <option value="die">die</option>
                  <option value="das">das</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleFileUpload(file, 'image')
                      updateVocabulary(index, 'image', url)
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                />
                {word.image && (
                  <img
                    src={word.image}
                    alt={word.word}
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleFileUpload(file, 'audio')
                      updateVocabulary(index, 'audio', url)
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5"
                />
                {word.audio && (
                  <audio controls className="mt-2 w-full">
                    <source src={word.audio} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
} 