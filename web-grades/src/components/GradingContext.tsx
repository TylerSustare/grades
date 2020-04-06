import React, { useState } from 'react';

export const GradingContext = React.createContext({
  schoolId: '',
  setSchoolId: (newClassId: string): void => {},
  classId: '',
  setClassId: (newSchoolId: string): void => {},
  assignmentId: '',
  setAssignmentId: (newAssignmentId: string): void => {},
});
GradingContext.displayName = 'GradingContext';

export const GradingProvider = ({ children }) => {
  const [assignmentId, setAssignmentId] = useState('');
  const [classId, setClassId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  return (
    <GradingContext.Provider
      value={{
        schoolId,
        setSchoolId,
        classId,
        setClassId,
        assignmentId,
        setAssignmentId,
      }}
    >
      {children}
    </GradingContext.Provider>
  );
};
