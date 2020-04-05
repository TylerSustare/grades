import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { withFirebaseHOC } from '../firebase';
import { Button } from '@material-ui/core';
import AddAssignmentForm from './AddAssignmentForm';

function getModalStyle() {
  const top = 15;
  const left = 40;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    buttonStyle: {
      marginTop: theme.spacing(2),
      fontSize: '1.4rem',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
    },
  })
);

function AddAssignmentModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <AddAssignmentForm onSubmit={handleClose} />
    </div>
  );

  return (
    <div>
      <Button className={classes.buttonStyle} type="button" onClick={handleOpen}>
        +
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
}

export default withFirebaseHOC(AddAssignmentModal);
