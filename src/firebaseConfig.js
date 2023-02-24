/* eslint-disable prefer-destructuring */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBYKUW1duKMgyKo9SPSW2AzeOx8PJjm3cA',
  authDomain: 'mintee-music.firebaseapp.com',
  projectId: 'mintee-music',
  storageBucket: 'mintee-music.appspot.com',
  messagingSenderId: '920008244379',
  appId: '1:920008244379:web:b9533b8a6ae3fb20855a3e',
  measurementId: 'G-FKZW59W5PP',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// eslint-disable-next-line no-unused-vars
export const storage = getStorage(app)
export const db = getFirestore(app)
export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      })
    }
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

export const logout = async () => {
  signOut(auth)
}
