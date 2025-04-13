import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import secret from "./secret";
import { getAuth } from "firebase/auth";

// Initialize Firebase app with the config
const firebaseConfig = secret;
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const auth = getAuth(app);
export const db = getFirestore(app);
