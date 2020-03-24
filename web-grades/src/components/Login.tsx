import React, { useContext, useCallback } from 'react';
import { withRouter, Redirect } from 'react-router';
import { AuthContext } from './Auth';
import { withFirebaseHOC } from '../firebase';
import { FirebaseWithRouterProps } from '../types/PropInterfaces';
import { Button } from '@material-ui/core';
import TopAppBar from './TopAppBar';

const C: React.FC<FirebaseWithRouterProps> = ({ firebase, history }) => {
  const { currentUser } = useContext(AuthContext);
  const handleGoogle = useCallback(async () => {
    await firebase.googleAuth();
    history.push('/');
  }, [history, firebase]);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <TopAppBar />
      <div className="App">
        <header className="App-header">
          <Button onClick={handleGoogle} color="primary">
            Google
          </Button>
        </header>
      </div>
    </>
  );
};

export default withFirebaseHOC(withRouter(C));
