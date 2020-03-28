import React, { useState, useEffect } from 'react';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import { makeStyles, TextField, colors, Button, CircularProgress } from '@material-ui/core';
import { AssignmentSubmission } from '../types/FirebaseModels';
import { useForm } from 'react-hook-form';
import ShowFiles from './ShowFiles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: '#333',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  scoreField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  commentField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '45vw',
    },
  },
  button: {
    display: 'block',
    margin: theme.spacing(1),
    backgroundColor: colors.blueGrey[800],
    color: '#fff',
  },
  loadingState: {
    margin: theme.spacing(4),
  },
}));

interface Props extends FirebaseProps {
  assignment: string;
  email: string;
  studentId: string;
}

const AssignmentGrading: React.FC<Props> = ({ firebase, email, assignment, studentId }) => {
  const [sub, setSub] = useState({} as AssignmentSubmission);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    async function getAssignments() {
      const studentSubmission = await firebase.getAssignmentByStudentEmail('7th', assignment, email);
      setSub(studentSubmission);
    }
    getAssignments();
  }, [assignment, email, firebase, isSubmitting]);
  const classes = useStyles();
  const { handleSubmit, register, errors, setValue } = useForm();
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const { score, studentComment, teacherComment } = values;
    const update = new AssignmentSubmission({
      files: [],
      score,
      studentComment,
      email: email,
      teacherComment,
      studentId,
    });
    await firebase.submitAssignmentToClass('7th', assignment, update);
    setIsSubmitting(false);
  };
  if (isSubmitting) {
    return (
      <div className={classes.loadingState}>
        <CircularProgress size={150} />
      </div>
    );
  }
  setValue('score', sub.score);
  setValue('teacherComment', sub.teacherComment);
  setValue('studentComment', sub.studentComment);
  return (
    <>
      <div>
        <h1>Submission for {email}</h1>
      </div>
      {assignment && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              className={classes.scoreField}
              error={errors.score != null && errors.score.message != null}
              id="score-submission-field"
              label="Submit Score"
              variant="outlined"
              name="score"
              defaultValue={sub.score}
              InputLabelProps={{
                shrink: true, // if score exists
              }}
              inputRef={register({
                pattern: {
                  value: /^[0-99999]/,
                  message: 'invalid score',
                },
              })}
            />
            {errors.score && errors.score.message}
          </div>
          <div>
            <TextField
              className={classes.commentField}
              error={errors.studentComment != null && errors.studentComment.message != null}
              id="studentComment-submission-field"
              label="Comments"
              variant="outlined"
              name="studentComment"
              multiline
              defaultValue={sub.studentComment}
              rowsMax="4"
              InputLabelProps={{
                shrink: true, // if email exists
              }}
              inputRef={register({
                validate: (value) => value !== 'admin' || 'Nice try!',
              })}
            />
            {errors.studentComment && errors.studentComment.message}
          </div>
          <ShowFiles assignment={assignment} files={sub.files} studentId={studentId} />

          <div>
            <TextField
              className={classes.commentField}
              error={errors.teacherComment != null && errors.teacherComment.message != null}
              id="teacherComment-submission-field"
              label="Comments"
              defaultValue={sub.teacherComment}
              variant="outlined"
              name="teacherComment"
              multiline
              rowsMax="4"
              InputLabelProps={{
                shrink: true, // if email exists
              }}
              inputRef={register({
                validate: (value) => value !== 'admin' || 'Nice try!',
              })}
            />
            {errors.teacherComment && errors.teacherComment.message}
            <Button type="submit" className={classes.button}>
              Submit Assignment
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default withFirebaseHOC(AssignmentGrading);
