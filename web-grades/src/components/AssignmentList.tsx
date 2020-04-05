import React, { useEffect, useState, useContext } from 'react';
import { FirebaseProps } from '../types/PropInterfaces';
import { withFirebaseHOC } from '../firebase';
import {
  makeStyles,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { GradingContext } from './GradingContext';
import { AuthContext } from './AuthContext';
import AddAssignmentForm from './AddAssignmentModal';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IDisplayAssignment, IGroupAssignmentsByDueAtLocalDateString } from '../types/FirebaseModels';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    fontSize: '1.2rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  selected: {
    margin: theme.spacing(1),
    fontSize: '1.4rem',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: '#fff',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  container: {
    margin: theme.spacing(2),
  },
}));

const ClassList: React.FC<FirebaseProps> = ({ firebase }) => {
  const { assignment, setAssignment } = useContext(GradingContext);
  const { isTeacher } = useContext(AuthContext);
  const [assignmentsByDueAt, setAssignmentsByDueAt] = useState({} as IGroupAssignmentsByDueAtLocalDateString);
  useEffect(() => {
    async function getAssignments() {
      // TODO: Send in ascending or descending as prop
      const byDueAt = await firebase.getAssignments('7th', 'asc');
      setAssignmentsByDueAt(byDueAt);
    }
    getAssignments();
  }, [firebase]);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h2>Assignments By Due Date</h2>
      {Object.keys(assignmentsByDueAt).map((dueAtLocalString) => (
        <ExpansionPanel key={dueAtLocalString}>
          <ExpansionPanelSummary
            key={dueAtLocalString}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography key={dueAtLocalString} className={classes.heading}>
              {dueAtLocalString}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails key={dueAtLocalString}>
            <ul className={classes.list}>
              {assignmentsByDueAt[dueAtLocalString].map((assignmentObject: IDisplayAssignment) => {
                return assignmentObject.name === assignment ? (
                  <li key={assignmentObject.name}>
                    <Button
                      className={classes.selected}
                      key={assignmentObject.name}
                      onClick={() => setAssignment(assignmentObject.name)}
                    >
                      {assignmentObject.name}
                    </Button>
                  </li>
                ) : (
                  <li key={assignmentObject.name}>
                    <Button
                      className={classes.root}
                      key={assignmentObject.name}
                      onClick={() => setAssignment(assignmentObject.name)}
                    >
                      {assignmentObject.name}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      {isTeacher && <AddAssignmentForm />}
    </div>
  );
};

export default withFirebaseHOC(ClassList);
