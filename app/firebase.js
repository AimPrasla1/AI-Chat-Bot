// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYAsK3pA3fS0abMDVQr9wmU68DDDoNFqY",
  authDomain: "ai-support-ab36c.firebaseapp.com",
  projectId: "ai-support-ab36c",
  storageBucket: "ai-support-ab36c.appspot.com",
  messagingSenderId: "407612979364",
  appId: "1:407612979364:web:e8945b55428e3e61b30e31",
  measurementId: "G-J3R8DGCHQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const signOutFromGoogle = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, signOutFromGoogle };
