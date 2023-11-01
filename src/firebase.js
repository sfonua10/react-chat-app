// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCCeM3R5sL2SJm_P8C7iWji4yWh6Xb-Qgk",
  authDomain: "react-chat-app-17b4c.firebaseapp.com",
  projectId: "react-chat-app-17b4c",
  storageBucket: "react-chat-app-17b4c.appspot.com",
  messagingSenderId: "341113114816",
  appId: "1:341113114816:web:81af879e1267dedd115d25",
};

const app = initializeApp(firebaseConfig);
const myAuth = getAuth(app);
const myFireStore = getFirestore(app);

export { myAuth, myFireStore, GoogleAuthProvider };
