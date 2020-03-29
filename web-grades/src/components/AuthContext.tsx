import React, { useEffect, useState } from 'react';
import { firebaseApp, firebaseUser } from '../firebase/firebase';

export const AuthContext = React.createContext({
  currentUser: {} as firebaseUser,
  isTeacher: false,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const isTeacher =
    currentUser?.email === 'brittany.sustare@saints.org' || currentUser?.email === 'darla.linn@saints.org';

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
