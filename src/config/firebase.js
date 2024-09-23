// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC40AjcA66dU5qFS0oXf3nMURvimL2q1g",
  authDomain: "customer--managament.firebaseapp.com",
  projectId: "customer--managament",
  storageBucket: "customer--managament.appspot.com",
  messagingSenderId: "150339778304",
  appId: "1:150339778304:web:e214125f216fa26de465e5",
  measurementId: "G-XTFFPZBQ4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export {storage, googleProvider};