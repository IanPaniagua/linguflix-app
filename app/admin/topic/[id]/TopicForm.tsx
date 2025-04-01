'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, collection, DocumentData, Firestore } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, Storage } from 'firebase/storage'
import { db, storage, auth } from '@/lib/firebase'
import { PlusCircle, X, Save } from 'lucide-react'
import { signInWithPopup, GoogleAuthProvider, User, Auth } from 'firebase/auth'
import Image from 'next/image'

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
  thumbnail: string
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
  vocabulary: [],
  thumbnail: ''
}

interface TopicFormProps {
  id: string
}

export default function TopicForm({ id }: TopicFormProps) {
  const router = useRouter()
  const [topic, setTopic] = useState<TopicData>(emptyTopic)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return;
    }

    // Check if auth is available (client-side only)
    if (!auth) {
      console.error('Auth is not available');
      router.push('/admin');
      return;
    }

    // Set initial user state
    setUser(auth.currentUser);
    
    // Check if user is already signed in
    if (!auth.currentUser) {
      const signIn = async () => {
        try {
          const provider = new GoogleAuthProvider()
          const result = await signInWithPopup(auth as Auth, provider)
          setUser(result.user)
        } catch (error) {
          console.error('Error signing in:', error)
          router.push('/admin') // Redirect if auth fails
        }
      }
      signIn()
    }

    // Listen for auth state changes
    const unsubscribe = (auth as Auth).onAuthStateChanged((currentUser: User | null) => {
      setUser(currentUser)
      if (!currentUser) {
        router.push('/admin') // Redirect if user signs out
      }
    })

    // Define fetchTopic inside useEffect
    const fetchTopic = async () => {
      try {
        if (!db) {
          throw new Error('Firestore is not available');
        }
        
        const topicDoc = await getDoc(doc(db as Firestore, 'topics', id))
        if (topicDoc.exists()) {
          setTopic(topicDoc.data() as TopicData)
        }
      } catch (error) {
        console.error('Error fetching topic:', error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch topic data if not new
    if (id !== 'new') {
      fetchTopic()
    } else {
      setLoading(false)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const topicData: DocumentData = {
        title: topic.title,
        description: topic.description,
        level: topic.level,
        video: topic.video,
        phrases: topic.phrases,
        vocabulary: topic.vocabulary,
        updatedAt: new Date().toISOString(),
        thumbnail: topic.thumbnail
      }

      if (id === 'new') {
        const topicsRef = collection(db, 'topics')
        const newDocRef = doc(topicsRef)
        await setDoc(newDocRef, topicData)
        console.log('New topic created successfully')
      } else {
        const topicRef = doc(db, 'topics', id)
        await updateDoc(topicRef, topicData)
        console.log('Topic updated successfully')
      }
      router.push('/admin')
    } catch (error) {
      console.error('Error saving topic:', error)
      alert('Error saving topic. Please try again.')
    }
  }

  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    try {
      if (!user) {
        throw new Error('You must be signed in to upload files')
      }

      const timestamp = Date.now()
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const fileName = `${type}s/${timestamp}-${safeFileName}`
      const storageRef = ref(storage, fileName)
      
      console.log('Uploading file:', fileName)
      const snapshot = await uploadBytes(storageRef, file)
      console.log('File uploaded successfully:', snapshot.ref.fullPath)
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('File URL:', downloadURL)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      if (error instanceof Error) {
        alert(`Error uploading ${type}: ${error.message}`)
      } else {
        alert(`Error uploading ${type}. Please try again.`)
      }
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
          {id === 'new' ? 'Create New Topic' : 'Edit Topic'}
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
          <label className="block text-sm font-medium text-primary mb-1">Title</label>
          <input
            type="text"
            value={topic.title}
            onChange={(e) => setTopic({ ...topic, title: e.target.value })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Description</label>
          <textarea
            value={topic.description}
            onChange={(e) => setTopic({ ...topic, description: e.target.value })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Imagen de Portada</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                const url = await handleFileUpload(file, 'image')
                if (url) {
                  setTopic({ ...topic, thumbnail: url })
                }
              }
            }}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
          />
          {topic.thumbnail && (
            <div className="mt-2 space-y-2">
              <Image
                src={topic.thumbnail}
                alt="Imagen de portada"
                width={828}
                height={315}
                className="w-full h-48 object-cover rounded-md"
                priority
              />
              <p className="text-xs text-primary/60 break-all">{topic.thumbnail}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Level</label>
          <select
            value={topic.level}
            onChange={(e) => setTopic({ ...topic, level: e.target.value as TopicData['level'] })}
            className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
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
        <h2 className="text-xl font-semibold text-primary">Video</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Type</label>
            <select
              value={topic.video.type}
              onChange={(e) => setTopic({
                ...topic,
                video: { ...topic.video, type: e.target.value as 'youtube' | 'local' }
              })}
              className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
            >
              <option value="youtube">YouTube</option>
              <option value="local">Local File</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">URL</label>
            <input
              type="text"
              value={topic.video.url}
              onChange={(e) => setTopic({
                ...topic,
                video: { ...topic.video, url: e.target.value }
              })}
              className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Phrases Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Phrases</h2>
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
                <label className="block text-sm font-medium text-primary mb-1">German</label>
                <input
                  type="text"
                  value={phrase.german}
                  onChange={(e) => updatePhrase(index, 'german', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Spanish</label>
                <input
                  type="text"
                  value={phrase.spanish}
                  onChange={(e) => updatePhrase(index, 'spanish', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleFileUpload(file, 'audio')
                      if (url) {
                        updatePhrase(index, 'audio', url)
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                />
                {phrase.audio && (
                  <div className="mt-2 space-y-2">
                    <audio controls className="w-full">
                      <source src={phrase.audio} type="audio/mpeg" />
                    </audio>
                    <p className="text-xs text-primary/60 break-all">{phrase.audio}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Vocabulary</h2>
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
                <label className="block text-sm font-medium text-primary mb-1">Word</label>
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => updateVocabulary(index, 'word', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Article</label>
                <select
                  value={word.article}
                  onChange={(e) => updateVocabulary(index, 'article', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  required
                >
                  <option value="">Select...</option>
                  <option value="der">der</option>
                  <option value="die">die</option>
                  <option value="das">das</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Imagen</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'url') {
                          // Limpiar el input de archivo si cambiamos a URL
                          const fileInput = document.getElementById(`vocab-file-${index}`) as HTMLInputElement
                          if (fileInput) fileInput.value = ''
                        }
                      }}
                      className="px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                    >
                      <option value="file">Subir archivo</option>
                      <option value="url">URL de Unsplash</option>
                    </select>
                  </div>

                  {/* Input para archivo */}
                  <input
                    id={`vocab-file-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = await handleFileUpload(file, 'image')
                        if (url) {
                          updateVocabulary(index, 'image', url)
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  />

                  {/* Input para URL */}
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => {
                      if (e.target.value.includes('unsplash.com')) {
                        updateVocabulary(index, 'image', e.target.value)
                      } else {
                        alert('Por favor, introduce una URL válida de Unsplash')
                      }
                    }}
                    className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                  />

                  {/* Vista previa de la imagen */}
                  {word.image && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={word.image}
                        alt={word.word}
                        width={384}
                        height={256}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-xs text-primary/60 break-all">{word.image}</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleFileUpload(file, 'audio')
                      if (url) {
                        updateVocabulary(index, 'audio', url)
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary/50 rounded-md border border-white/5 text-primary"
                />
                {word.audio && (
                  <div className="mt-2 space-y-2">
                    <audio controls className="w-full">
                      <source src={word.audio} type="audio/mpeg" />
                    </audio>
                    <p className="text-xs text-primary/60 break-all">{word.audio}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
} 