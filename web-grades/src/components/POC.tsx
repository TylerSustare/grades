import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import logo from './logo.svg';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';

const C: React.FC<FirebaseProps> = ({ firebase }) => {
  const [state, setState] = useState({});
  useEffect(() => {
    async function getUser() {
      const user = await firebase.getNewUser('al');
      setState(user.data());
    }
    getUser();
  }, [firebase]);
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button onClick={() => firebase.signOut()}>signout</button>
          <div>{JSON.stringify(currentUser.uid)}</div>
          <div>{JSON.stringify(state)}</div>
        </header>
      </div>
    </>
  );
};

export default withFirebaseHOC(C);
export { C };
