// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhVV4YKARRZkCePsxfx_CKpYNN1reBUxY",
  authDomain: "oems-project.firebaseapp.com",
  projectId: "oems-project",
  storageBucket: "oems-project.appspot.com",
  messagingSenderId: "363449294222",
  appId: "1:363449294222:web:42ffcf4efa65d0ff2218df",
  measurementId: "G-WDXDN84XZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);