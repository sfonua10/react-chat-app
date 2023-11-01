import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";
import styled from "styled-components";


const app = initializeApp(firebaseConfig);
const myAuth = getAuth(app);
const myFireStore = getFirestore(app);

const SignInButton = styled.button`
  background: linear-gradient(90deg, #63b3ed, #3182ce);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
`;

const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(myAuth, provider);

    // After successful sign-in, check if user exists in Firestore.
    if (result) {
      const user = result.user;
      const userRef = doc(myFireStore, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      // If user does not exist in Firestore, add them.
      if (!docSnapshot.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email,
          // ... any other fields you want to save for the user.
        });
      } else {
        // If user exists, just update their online status
        await setDoc(userRef, { online: true }, { merge: true });
      }
    }
  };

  return (
    <>
      <SignInButton className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </SignInButton>
      <p>Do not violate the community guidelines or you will be banned!</p>
    </>
  );
};

export default SignIn;
