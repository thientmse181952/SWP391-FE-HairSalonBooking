// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider, getAuth, RecaptchaVerifier } from "firebase/auth";  // Added getAuth and RecaptchaVerifier

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSSwW5jP46Cf8TyN3j-VZ-ejJeuNwvQEg",
  authDomain: "swp391-7123d.firebaseapp.com",
  projectId: "swp391-7123d",
  storageBucket: "swp391-7123d.appspot.com",
  messagingSenderId: "400920024316",
  appId: "1:400920024316:web:677422f73192ad082bf379",
  measurementId: "G-C6BL7WB2LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);  // Initialize Firebase Auth

// Function to setup Recaptcha
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(containerId, {
    size: "invisible", // Hiển thị Recaptcha vô hình
    callback: (response) => {
      console.log("Recaptcha resolved");
    },
  }, auth);
};

export { storage, googleProvider, auth };  // Export necessary authentication features
