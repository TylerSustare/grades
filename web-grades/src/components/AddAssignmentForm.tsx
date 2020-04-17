import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { withFirebaseHOC } from '../firebase';
import { TextField, Button, makeStyles, CircularProgress } from '@material-ui/core';
import { FirebaseProps } from '../types/PropInterfaces';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  scoreField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    display: 'block',
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  loadingState: {
    margin: theme.spacing(4),
  },
}));

interface Props extends FirebaseProps {
  onSubmit?: Function;
}

const AddAssignmentForm: React.FC<Props> = ({ firebase, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const { register, handleSubmit, errors } = useForm();
  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    await firebase.createNewAssignment('7th', data.assignmentName, selectedDate);
    setIsSubmitting(false);
    if (onSubmit) {
      onSubmit();
    }
  };
  const classes = useStyles();
  if (isSubmitting) {
    return (
      <div className={classes.loadingState}>
        <CircularProgress size={150} />
      </div>
    );
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <TextField
            className={classes.scoreField}
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
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </div>

        <Button type="submit" className={classes.button}>
          Create Assignment
        </Button>
      </form>
    </MuiPickersUtilsProvider>
  );
};

export default withFirebaseHOC(AddAssignmentForm);
