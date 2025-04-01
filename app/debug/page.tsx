'use client'

import { useEffect, useState } from 'react'
import { app, db, auth } from '@/lib/firebase'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [firebaseStatus, setFirebaseStatus] = useState<Record<string, boolean>>({})
  
  useEffect(() => {
    // Verificar variables de entorno
    const vars = {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    setEnvVars(vars)
    
    // Verificar estado de Firebase
    setFirebaseStatus({
      app: !!app,
      db: !!db,
      auth: !!auth
    })
  }, [])
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Firebase Configuration</h1>
      
      <div className="mb-8 bg-secondary/30 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <pre className="bg-black/50 p-4 rounded-md overflow-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8 bg-secondary/30 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Firebase Status</h2>
        <pre className="bg-black/50 p-4 rounded-md overflow-auto">
          {JSON.stringify(firebaseStatus, null, 2)}
        </pre>
      </div>
      
      <div className="mt-8 text-primary/60">
        <p>Nota: Esta página muestra solo la disponibilidad de las variables, no sus valores, para mantener la seguridad.</p>
        <p className="mt-2">Después de resolver el problema, <strong>elimina esta página</strong>.</p>
      </div>
    </div>
  )
} 