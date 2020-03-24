import React, { useEffect, useState, useContext } from 'react';
import { FirebaseProps } from '../types/PropInterfaces';
import { withFirebaseHOC } from '../firebase';
import { makeStyles, Button, colors } from '@material-ui/core';
import { GradingContext } from './GradingContext';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
    fontSize: '2rem',
    backgroundColor: colors.blueGrey[800],
    color: 'white'
  },
  selected: {
    margin: theme.spacing(3),
    fontSize: '2rem',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white'
  }
}));

const ClassList: React.FC<FirebaseProps> = ({ firebase }) => {
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    async function getAssignments() {
      const assignments = await firebase.getAssignments('7th');
      setAssignments(assignments);
    }
    getAssignments();
    // return () => { cleanup; };
  }, [firebase]);
  const classes = useStyles();
  const { assignment, setAssignment } = useContext(GradingContext);
  return (
    <>
      {assignments.map((a) => {
        return a === assignment ? (
          <Button className={classes.selected} key={a} onClick={() => setAssignment(a)}>
            {a}
          </Button>
        ) : (
          <Button className={classes.root} key={a} onClick={() => setAssignment(a)}>
            {a}
          </Button>
        );
      })}
    </>
  );
};

export default withFirebaseHOC(ClassList);
