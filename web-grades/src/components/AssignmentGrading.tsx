import React, { useContext, useState, useEffect } from 'react';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import { Typography, makeStyles } from '@material-ui/core';
import { GradingContext } from './GradingContext';
import { AssignmentSubmission } from '../types/FirebaseModels';

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

const AssignmentGrading: React.FC<FirebaseProps> = ({ firebase }) => {
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([] as AssignmentSubmission[]);
  const { assignment } = useContext(GradingContext);
  useEffect(() => {
    async function getAssignments() {
      const assignments = await firebase.getAssignmentSubmissions('7th', assignment);
      setAssignmentSubmissions(assignments);
    }
    getAssignments();
  }, [firebase, assignment]);
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.root} color="textPrimary">
        <h2>{assignment}</h2>
        {assignment && assignmentSubmissions && assignmentSubmissions.length > 0 ? (
          assignmentSubmissions.map((a) => {
            return (
              <>
                <p>Email: {a.email}</p>
                <p>
                  Score: {a.score}/{a.possibleScore}
                </p>
              </>
            );
          })
        ) : (
          <></>
        )}
      </Typography>
    </>
  );
};

export default withFirebaseHOC(AssignmentGrading);
