// src/hooks/useAuth.js
import { useAuthState } from "react-firebase-hooks/auth";
import { myAuth } from "../firebase";

function useAuth() {
  const [user] = useAuthState(myAuth);
  return { user, isAuthenticated: !!user };
}

export default useAuth;
