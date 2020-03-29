import React from 'react';
import { useForm } from 'react-hook-form';
import { withFirebaseHOC } from '../firebase';
import { TextField, Button, makeStyles, colors } from '@material-ui/core';
import { FirebaseProps } from '../types/PropInterfaces';

const useStyles = makeStyles((theme) => ({
  nameField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    display: 'block',
    margin: theme.spacing(1),
    backgroundColor: colors.blueGrey[800],
    color: '#fff',
  },
}));

interface Props extends FirebaseProps {
  onSubmit?: Function;
}

const AddAssignmentForm: React.FC<Props> = ({ firebase, onSubmit }) => {
  const { register, handleSubmit, watch, errors } = useForm();
  const onFormSubmit = async (data) => {
    await firebase.createNewAssignment('7th', data.assignmentName);
    if (onSubmit) {
      onSubmit();
    }
    window.location.reload(false); // 🔔 shame
  };

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <TextField
          className={classes.nameField}
          error={errors.assignmentName != null && errors.assignmentName.message != null}
          id="assignmentName-submission-field"
          label="New Assignment Name"
          variant="outlined"
          name="assignmentName"
          InputLabelProps={{
            shrink: true,
          }}
          inputRef={register({
            required: 'Required',
          })}
        />
        {errors.assignmentName && errors.assignmentName.message}
      </div>

      <Button type="submit" className={classes.button}>
        Create Assignment
      </Button>
    </form>
  );
};

export default withFirebaseHOC(AddAssignmentForm);
