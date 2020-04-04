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

  const { assignment } = useContext(GradingContext);
  useEffect(() => {
    async function getAssignments() {
      const assignments = await firebase.getAssignmentSubmissions('7th', assignment);
      setAssignmentSubmissions(assignments);
    }
    getAssignments();
  }, [firebase, assignment]);
  return (
    <>
      <h1 className={classes.title}>{assignment}</h1>
      {assignment && assignmentSubmissions && assignmentSubmissions.length > 0 ? (
        assignmentSubmissions.map((a) => {
          return (
            <Card className={classes.root}>
              <TeacherResponseForm
                key={`${assignment}-${a.email}`}
                assignment={assignment}
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
