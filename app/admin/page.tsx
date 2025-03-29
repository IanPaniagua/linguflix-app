'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

interface Topic {
  id: string
  title: string
  level: 'basic' | 'intermediate' | 'advanced'
  description: string
}

export default function AdminPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [])

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

  const deleteTopic = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteDoc(doc(db, 'topics', id))
        setTopics(topics.filter(topic => topic.id !== id))
      } catch (error) {
        console.error('Error deleting topic:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Topics Overview</h1>
        <Link 
          href="/admin/topic/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          New Topic
        </Link>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-secondary/50 p-4 rounded-lg border border-white/5 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-primary">{topic.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                  {topic.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/topic/${topic.id}`}
                  className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => deleteTopic(topic.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No topics found. Create your first topic to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
} 