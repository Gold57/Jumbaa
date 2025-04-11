// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import secret from "../secret";


const firebaseConfig = secret;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };