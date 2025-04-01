import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

// Log environment variables availability (without showing actual values)
if (typeof window !== 'undefined') {
  console.log("Firebase env vars available?", {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  });
}

// Intentamos leer desde el código y también usar valores de respaldo hardcodeados
// NOTA: Esto es solo para diagnosticar problemas. En producción, 
// debes configurar correctamente las variables de entorno en Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDarB6ZvyP658KerFhmCi5lDGchurgWR5U',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'linguaflix-92d8f.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'linguaflix-92d8f',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'linguaflix-92d8f.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '722598512092',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:722598512092:web:64ff973b547042f56b3b19'
}

// Initialize Firebase only on the client side
let app;
let db;
let storage;
let auth;

// Verificar que estamos en el cliente
if (typeof window !== 'undefined') {
  try {
    // Log config (without apiKey for security)
    console.log("Attempting Firebase initialization with config:", {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
      apiKey: firebaseConfig.apiKey ? "[PRESENTE]" : "[AUSENTE]"
    });
    
    // Intentar inicializar Firebase
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized for the first time");
    } else {
      app = getApp();
      console.log("Using existing Firebase app");
    }
    
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log("Firebase services initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { app, db, storage, auth } 