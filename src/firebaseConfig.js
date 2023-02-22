// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
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
const app = initializeApp(firebaseConfig)
// eslint-disable-next-line no-unused-vars
export const storage = getStorage(app)
