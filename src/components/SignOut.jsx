import React from "react";
import styled from "styled-components";
import { myAuth, myFireStore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const SignOutButton = styled.button`
  background-color: #e53e3e;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 16px;
`;

const SignOut = () => {
  const signOutUser = async () => {
    if (myAuth.currentUser) {
      const userRef = doc(myFireStore, "users", myAuth.currentUser.uid);
      await setDoc(userRef, { online: false }, { merge: true });
      await signOut(myAuth);
    }
  };

  return (
    myAuth.currentUser && (
      <SignOutButton className="sign-out" onClick={signOutUser}>
        Sign Out
      </SignOutButton>
    )
  );
};

export default SignOut;
