
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "lms-website-dbc47.firebaseapp.com",
  projectId: "lms-website-dbc47",
  storageBucket: "lms-website-dbc47.firebasestorage.app",
  messagingSenderId: "614972683494",
  appId: "1:614972683494:web:f26bea4a7ea67575b7b727"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()