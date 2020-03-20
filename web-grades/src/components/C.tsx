import React, { useContext } from 'react';
import { AuthContext } from './Auth';

const C = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{JSON.stringify(currentUser)}</div>;
};

export { C };
