import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './Auth';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import { Button, Typography, makeStyles } from '@material-ui/core';
import TopAppBar from './TopAppBar';
import AssignmentList from './AssignmentList';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: '#333',
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const Home: React.FC<FirebaseProps> = ({ firebase }) => {
  const [state, setState] = useState({});
  useEffect(() => {
    async function getUser() {
      const user = await firebase.getNewUser('al');
      setState(user.data());
    }
    getUser();
  }, [firebase]);
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  return (
    <>
      <TopAppBar />
      <div className="container">
        <div className="left">
          <AssignmentList />
        </div>
        <div className="right">
          <Typography className={classes.root} color="textPrimary">
            {JSON.stringify(state)}
          </Typography>
          <Button onClick={() => firebase.signOut()} color="primary">
            Sign Out
          </Button>
          <div>{JSON.stringify(currentUser.uid)}</div>
        </div>
      </div>
    </>
  );
};

export default withFirebaseHOC(Home);
