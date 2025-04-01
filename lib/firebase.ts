import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase only on the client side
let app = null
let db = null
let storage = null
let auth = null

// Solo inicializamos Firebase si estamos en el navegador y tenemos todas las configuraciones necesarias
if (typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    db = getFirestore(app)
    storage = getStorage(app)
    auth = getAuth(app)
  } catch (error) {
    console.error('Error initializing Firebase:', error)
  }
}

export { app, db, storage, auth } 