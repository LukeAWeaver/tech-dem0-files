import { type FirebaseOptions, initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initFireBase = (firebaseConfig: FirebaseOptions) => {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig)
    console.log('firebase initialized')
    return app
  } else {
    console.log('firebase already initialized')
    return getApp() // if already initialized, use that one
  }
}
const firebaseApp = initFireBase(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const RTDB = getDatabase(firebaseApp)
export const googleProvider = new GoogleAuthProvider()
