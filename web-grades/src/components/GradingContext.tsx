import React, { useState } from 'react';

export const GradingContext = React.createContext({
  assignment: '',
  setAssignment: (newAssignment: string): void => {}
});
GradingContext.displayName = 'GradingContext';

export const GradingProvider = ({ children }) => {
  const [assignment, setAssignment] = useState('');
  return (
    <GradingContext.Provider
      value={{
        assignment,
        setAssignment
      }}
    >
      {children}
    </GradingContext.Provider>
  );
};
