// import MenuIcon from '@material-ui/icons/Menu';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Button, Typography, makeStyles, AppBar, Toolbar, Avatar } from '@material-ui/core';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: '#333',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const TopAppBar: React.FC<FirebaseProps> = ({ firebase }) => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  return (
    <AppBar position="static">
      <Toolbar>
        {currentUser && <Avatar className={classes.avatar} alt={currentUser.displayName} src={currentUser.photoURL} />}
        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> <MenuIcon /> </IconButton> */}
        <Typography variant="h6" className={classes.title}>
          {currentUser ? currentUser.email : ''} 7th Grades
        </Typography>
        {currentUser ? (
          <Button onClick={() => firebase.signOut()} color="inherit">
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => firebase.googleAuth()} color="inherit">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withFirebaseHOC(TopAppBar);
