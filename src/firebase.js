// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkGaFN-YBVOBKuLRoxFD7i1T1-NZldf4A",
  authDomain: "finance-tracker-1aa1c.firebaseapp.com",
  projectId: "finance-tracker-1aa1c",
  storageBucket: "finance-tracker-1aa1c.firebasestorage.app",
  messagingSenderId: "410258135550",
  appId: "1:410258135550:web:49ca00684fd2d7777788af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth (Google Login)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 💾 Firestore (Database)
export const db = getFirestore(app);