import React, { useContext, useState, useEffect } from 'react';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import { GradingContext } from './GradingContext';
import { AssignmentSubmission } from '../types/FirebaseModels';
import TeacherResponseForm from './TeacherResponseForm';
import { Card, makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
  title: {
    textAlign: 'center',
    margin: theme.spacing(2),
  },
}));

const AssignmentGrading: React.FC<FirebaseProps> = ({ firebase }) => {
  const classes = useStyles();
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([] as AssignmentSubmission[]);

  const { assignmentId } = useContext(GradingContext);
  useEffect(() => {
    if (assignmentId) {
      const unsubscribe = firebase.subscribeToAssignmentSubmissions('7th', assignmentId, setAssignmentSubmissions);
      return function cleanup() {
        unsubscribe();
      };
    }
  }, [assignmentId, firebase]);
  return (
    <>
      <h1 className={classes.title}>{assignmentId}</h1>
      {assignmentId && assignmentSubmissions && assignmentSubmissions.length > 0 ? (
        assignmentSubmissions.map((a) => {
          return (
            <Card key={a.email} className={classes.root}>
              <TeacherResponseForm
                key={`${assignmentId}-${a.email}`}
                assignment={assignmentId}
                email={a.email}
                score={a.score}
                studentComment={a.studentComment}
                teacherComment={a.teacherComment}
                files={a.files}
                studentId={a.studentId}
              />
            </Card>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default withFirebaseHOC(AssignmentGrading);
