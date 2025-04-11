// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEj8xhmItrc9t_L8qQMlsNj4A33XZGMhw",
  authDomain: "jumbaa-6fada.firebaseapp.com",
  projectId: "jumbaa-6fada",
  storageBucket: "jumbaa-6fada.firebasestorage.app",
  messagingSenderId: "194385057697",
  appId: "1:194385057697:web:9ba46d49f3b73c07395de0",
  measurementId: "G-7T4JP2VFGD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
