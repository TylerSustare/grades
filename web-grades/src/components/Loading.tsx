import React from 'react';
import { FirebaseProps } from '../types/PropInterfaces';
import LoadingAppBar from './LoadingAppBar';
import { CircularProgress, colors, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    backgroundColor: colors.red[800],
    color: colors.blueGrey[800],
    flexGrow: 1,
  },
  loadingState: {
    margin: theme.spacing(4),
  },
}));

export const LoadingPage: React.FC<FirebaseProps> = () => {
  const classes = useStyles();
  return (
    <>
      <LoadingAppBar />
      <div className="App">
        <div className={classes.loadingState}>
          <CircularProgress size={150} />
        </div>
      </div>
    </>
  );
};
