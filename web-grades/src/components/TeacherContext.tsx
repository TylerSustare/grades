import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { withFirebaseHOC } from '../firebase';
import { FirebaseWithChildrenProps } from '../types/PropInterfaces';

export const TeacherContext = React.createContext({
  isTeacher: false,
});

const TeacherProvider: React.FC<FirebaseWithChildrenProps> = ({ children, firebase }) => {
  const { currentUser } = useContext(AuthContext);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    async function getUsers() {
      try {
        const teachers = await firebase.getTeacherList('7th');
        setIsTeacher(teachers.includes(currentUser?.email));
      } catch (error) {
        error.code === 'permission-denied'
          ? setIsTeacher(false)
          : alert('There was an unexpected error. If this persists please contact your teacher.');
      }
    }
    getUsers();
  }, [currentUser, firebase]);

  return (
    <TeacherContext.Provider
      value={{
        isTeacher,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export default withFirebaseHOC(TeacherProvider);
