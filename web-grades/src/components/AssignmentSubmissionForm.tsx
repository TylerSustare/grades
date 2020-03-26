import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withFirebaseHOC } from '../firebase';
import { AuthContext } from './Auth';
import { FirebaseProps } from '../types/PropInterfaces';
import { makeStyles, TextField, Button, colors } from '@material-ui/core';
import { GradingContext } from './GradingContext';
import { AssignmentSubmission } from '../types/FirebaseModels';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: '#333',
    flexGrow: 1
  },
  forms: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  button: {
    display: 'block',
    margin: theme.spacing(1),
    backgroundColor: colors.blueGrey[800],
    color: 'white'
  }
}));

const AssignmentSubmissionForm: React.FC<FirebaseProps> = ({ firebase }) => {
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (values) => {
    console.log(values);
  };

  const [assignmentSubmission, setAssignmentSubmission] = useState({} as AssignmentSubmission);
  const { currentUser } = useContext(AuthContext);
  const { assignment } = useContext(GradingContext);
  useEffect(() => {
    async function getAssignments() {
      const studentSubmission = await firebase.getAssignmentByStudentEmail('7th', assignment, currentUser.email);
      setAssignmentSubmission(studentSubmission);
    }
    getAssignments();
  }, [firebase, assignment, currentUser.email]);
  const classes = useStyles();
  return (
    <>
      <h2>{assignment}</h2>
      {assignment && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={classes.forms}
            error={errors.email != null && errors.email.message != null}
            id="score-submission-field"
            label="Submit Score"
            variant="outlined"
            name="score"
            inputRef={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid email address'
              }
            })}
          />
          {errors.email && errors.email.message}

          <TextField
            className={classes.forms}
            error={errors.email != null && errors.email.message != null}
            id="score-submission-field"
            label="Submit Score"
            variant="outlined"
            name="username"
            inputRef={register({
              validate: (value) => value !== 'admin' || 'Nice try!'
            })}
          />
          {errors.username && errors.username.message}

          <Button type="submit" className={classes.button}>
            Submit Assignment
          </Button>
        </form>
      )}
    </>
  );
};

export default withFirebaseHOC(AssignmentSubmissionForm);
