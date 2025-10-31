// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Auth
// import { getDatabase } from "firebase/database"; // Realtime DB (optional)

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-g129eMoneCZhg3Yt9-sNqRS_1TmJRmA",
  authDomain: "medilink-202c0.firebaseapp.com",
  projectId: "medilink-202c0",
  storageBucket: "medilink-202c0.appspot.com",
  messagingSenderId: "628339778865",
  appId: "1:628339778865:web:649eba18ea7471e12e3c10",
  measurementId: "G-B6SNTT1GEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Pick your database
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// const db = getDatabase(app);

export { db, auth, googleProvider };
