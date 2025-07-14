// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "yogi-estate-updated.firebaseapp.com",
  projectId: "yogi-estate-updated",
  storageBucket: "yogi-estate-updated.firebasestorage.app",
  messagingSenderId: "590791882001",
  appId: "1:590791882001:web:2dff4070e9cb2e08c088b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);