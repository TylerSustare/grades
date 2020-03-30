import React, { useContext, useCallback } from 'react';
import { withRouter, Redirect } from 'react-router';
import { AuthContext } from './AuthContext';
import { withFirebaseHOC } from '../firebase';
import { FirebaseWithRouterProps } from '../types/PropInterfaces';
import { Button, makeStyles, colors } from '@material-ui/core';
import TopAppBar from './TopAppBar';
import trinityLogo from '../trinity.png';
declare module '*.png';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    backgroundColor: colors.red[800],
    color: colors.blueGrey[800],
    flexGrow: 1,
  },
}));

const C: React.FC<FirebaseWithRouterProps> = ({ firebase, history }) => {
  const classes = useStyles();
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
        <h2>Please log in with your Saints Google Account</h2>
        <div>
          <img src={trinityLogo} alt="trinity lutheran school logo" />
        </div>
        <Button className={classes.root} onClick={handleGoogle} color="primary">
          Log in with Google
        </Button>
      </div>
    </>
  );
};

export default withFirebaseHOC(withRouter(C));
