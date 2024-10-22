import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc } from "firebase/firestore";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = {
    isAuthenticated,
    setIsAuthenticated: (value) => setIsAuthenticated(value),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
