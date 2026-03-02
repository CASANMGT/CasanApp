// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCk-g8pR2OA6BTFOe6sb7-jAwPoF5i5wsI",
  authDomain: "tebengan-project.firebaseapp.com",
  databaseURL: "https://tebengan-project.firebaseio.com",
  projectId: "tebengan-project",
  storageBucket: "tebengan-project.firebasestorage.app",
  messagingSenderId: "1014253035620",
  appId: "1:1014253035620:web:92682f30aa9d247be2ff71",
  measurementId: "G-KGWT3KXTSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);