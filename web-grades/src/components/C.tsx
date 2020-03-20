import React, { useContext } from 'react';
import { AuthContext } from './Auth';
import logo from './logo.svg';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';

const C: React.FC<FirebaseProps> = ({ firebase }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={() => firebase.signOut()}>signout</button>
        <div>{JSON.stringify(currentUser.uid)}</div>
      </header>
    </div>
  );
};

export default withFirebaseHOC(C);
export { C };
