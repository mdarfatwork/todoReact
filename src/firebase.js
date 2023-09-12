// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9PiNpo1DtWnPOUxvqng69sTbxdwaS3dU",
  authDomain: "todo-list-95f34.firebaseapp.com",
  databaseURL: "https://todo-list-95f34-default-rtdb.firebaseio.com",
  projectId: "todo-list-95f34",
  storageBucket: "todo-list-95f34.appspot.com",
  messagingSenderId: "150405816486",
  appId: "1:150405816486:web:e9c48b03ecb670847e9467"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth()