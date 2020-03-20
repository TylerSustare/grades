import React from 'react';
import logo from './logo.svg';
import { withFirebaseHOC } from '../firebase';
import './App.css';
import { IFirebase } from '../firebase/firebase';
import { AuthProvider } from './Auth';
import { C } from './C';

interface Props {
  firebase: IFirebase;
}

const App: React.FC<Props> = ({ firebase }) => {
  const handleGoogle = async () => {
    const user = await firebase.googleAuth();
    console.log('user', JSON.stringify(user, null, 2));
  };
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button onClick={handleGoogle}>Google</button>
          <C />
        </header>
      </div>
    </AuthProvider>
  );
};

export default withFirebaseHOC(App);
