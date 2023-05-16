import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBzlY0woXuXM82NubAFOOAbzJM5IYxeeEU',
  authDomain: 'filmoff-b5837.firebaseapp.com',
  projectId: 'filmoff-b5837',
  storageBucket: 'filmoff-b5837.appspot.com',
  messagingSenderId: '238921218422',
  appId: '1:238921218422:web:545156cec35fd982c42257',
  measurementId: 'G-MEM799CGW5',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
