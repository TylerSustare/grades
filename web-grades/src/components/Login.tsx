import React, { useContext, useCallback } from 'react';
import { withRouter, Redirect } from 'react-router';
import { AuthContext } from './Auth';
import { withFirebaseHOC } from '../firebase';
import { FirebaseWithRouterProps } from '../types/PropInterfaces';

const C: React.FC<FirebaseWithRouterProps> = ({ firebase, history }) => {
  const { currentUser } = useContext(AuthContext);
  console.log('currentUser', JSON.stringify(currentUser, null, 2));
  const handleGoogle = useCallback(async () => {
    await firebase.googleAuth();
    history.push('/');
  }, [history, firebase]);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleGoogle}>Google</button>
        <div>{JSON.stringify(currentUser, null, 2)}</div>
      </header>
    </div>
  );
};

export default withFirebaseHOC(withRouter(C));
