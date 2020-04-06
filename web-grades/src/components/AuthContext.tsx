import React, { useEffect, useState } from 'react';
import { firebaseApp, firebaseUser } from '../firebase/firebase';

export const AuthContext = React.createContext({
  currentUser: {} as firebaseUser,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
