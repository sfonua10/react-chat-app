// src/services/firestoreService.js
import {
    addDoc,
    collection,
    doc,
    getDoc,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    limit
  } from "firebase/firestore";
  import { myFireStore } from "../firebase";

  export const addUserToFirestore = async (user) => {
    const userRef = doc(myFireStore, "users", user.uid);
    const docSnapshot = await getDoc(userRef);
  
    if (!docSnapshot.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
      });
    } else {
      await setDoc(userRef, { online: true }, { merge: true });
    }
  };
  
  export const setUserOffline = async (uid) => {
    const userRef = doc(myFireStore, "users", uid);
    await setDoc(userRef, { online: false }, { merge: true });
  };
  
  export const sendMessageToFirestore = async (messagesRef, messageData) => {
    await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp(),
    });
  };
  
  export const createFirestoreQuery = (collectionPath, orderByField, limitNum) => {
    const messagesRef = collection(myFireStore, collectionPath);
    return query(messagesRef, orderBy(orderByField), limit(limitNum));
  };
  