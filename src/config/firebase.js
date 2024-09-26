// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-XQEWziho0lM_3hfHcf22C1IvIVeWiTQ",
  authDomain: "student-management-a03d5.firebaseapp.com",
  projectId: "student-management-a03d5",
  storageBucket: "student-management-a03d5.appspot.com",
  messagingSenderId: "1084687691935",
  appId: "1:1084687691935:web:1612eb8d3b210d5c75b2aa",
  measurementId: "G-C21WMTNCMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export {storage, googleProvider};