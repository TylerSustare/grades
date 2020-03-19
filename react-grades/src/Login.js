import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import app, { firebase } from './base.js';
import { AuthContext } from './Auth.js';

const Login = ({ history }) => {
  const handleGoogle = useCallback(
    async e => {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      await app.auth().signInWithPopup(googleProvider);
      history.push('/');
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in With Google</h1>
      <button onClick={handleGoogle}>Google</button>
    </div>
  );
};

export default withRouter(Login);
