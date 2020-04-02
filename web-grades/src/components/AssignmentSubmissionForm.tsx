import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withFirebaseHOC } from '../firebase';
import { AuthContext } from './AuthContext';
import { FirebaseProps } from '../types/PropInterfaces';
import { makeStyles, TextField, Button, colors, Typography, CircularProgress } from '@material-ui/core';
import { GradingContext } from './GradingContext';
import { AssignmentSubmission } from '../types/FirebaseModels';
import { filePrams } from '../firebase/firebase';
import ShowFiles from './ShowFiles';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: '#333',
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

const AssignmentSubmissionForm: React.FC<FirebaseProps> = ({ firebase }) => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { handleSubmit, register, errors, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [assignmentSubmission, setAssignmentSubmission] = useState({} as AssignmentSubmission);
  const { assignment } = useContext(GradingContext);

  useEffect(() => {
    async function getAssignments() {
      const studentSubmission = await firebase.getAssignmentByStudentEmail('7th', assignment, currentUser.email);
      setAssignmentSubmission(studentSubmission);
    }
    getAssignments();
  }, [assignment, currentUser.email, firebase, isSubmitting]);

  // set form values
  assignmentSubmission?.score ? setValue('score', assignmentSubmission?.score) : setValue('score', '');
  assignmentSubmission?.studentComment
    ? setValue('studentComment', assignmentSubmission?.studentComment)
    : setValue('studentComment', '');

  // set file name on page
  const onFileChange = (e) => {
    let name = '';
    if (e?.target?.files[0]) {
      for (const key in e.target.files) {
        if (e.target.files.hasOwnProperty(key)) {
          name += `${e.target.files[key].name},`;
        }
      }
      setFileName(name);
    }
  };

  // submit the form
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const { files, score, studentComment } = values;
    const fileIds: string[] = [];
    for (let index = 0; index < files.length; index++) {
      const options: filePrams = {
        classId: '7th',
        assignmentId: assignment,
        studentUid: currentUser.uid,
        file: files[index],
        fileId: files[index].name,
      };
      fileIds.push(files[index].name);
      await firebase.uploadFileToAssignment(options);
    }

    const submission = new AssignmentSubmission({
      files: fileIds,
      score,
      teacherComment: assignmentSubmission.teacherComment,
      studentComment,
      email: currentUser.email,
      studentId: currentUser.uid,
    });
    await firebase.submitAssignmentToClass('7th', assignment, submission);
    setFileName('');
    setIsSubmitting(false);
    alert('Nice work! Your assignment was successfully submitted to Mrs. Sustare and Mrs. Linn :)');
  };
  if (isSubmitting) {
    return (
      <div className={classes.loadingState}>
        <CircularProgress size={150} />
      </div>
    );
  }
  return (
    <>
      <h2>{assignment}</h2>
      {assignment && <h4>(remember to click the "Submit Assignment" button)</h4>}
      {!assignment ? (
        <div>
          <h2>Please select an assignment.</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              className={classes.scoreField}
              error={errors.score != null && errors.score.message != null}
              id="score-submission-field"
              label="Number of Incorrect"
              variant="outlined"
              name="score"
              InputLabelProps={{
                shrink: true, // if score exists
              }}
              inputRef={register({
                // required: 'Required',
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
          <div className="upload-btn-wrapper">
            <button className="btn">Upload Files</button>
            <input type="file" name="files" ref={register()} multiple onChange={onFileChange} />
            <span>{fileName}</span>
          </div>
          <ShowFiles assignment={assignment} files={assignmentSubmission?.files} />

          <Button type="submit" className={classes.button}>
            Submit Assignment
          </Button>
        </form>
      )}
      {assignment && (
        <>
          <h2>Teacher Feedback</h2>
          <Typography className={classes.root} color="textPrimary">
            {assignmentSubmission?.teacherComment}
            <br />
          </Typography>
        </>
      )}
    </>
  );
};

export default withFirebaseHOC(AssignmentSubmissionForm);
