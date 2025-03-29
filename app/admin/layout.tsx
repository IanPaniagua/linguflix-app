'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user?.email !== 'paniagua.ian.de@gmail.com') {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (user?.email !== 'paniagua.ian.de@gmail.com') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-secondary/50 border-r border-white/5">
          <div className="p-4">
            <h2 className="text-xl font-bold text-primary">Admin Dashboard</h2>
          </div>
          <nav className="mt-4">
            <a
              href="/admin"
              className="block px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
            >
              Topics Overview
            </a>
            <a
              href="/admin/media"
              className="block px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
            >
              Media Manager
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 