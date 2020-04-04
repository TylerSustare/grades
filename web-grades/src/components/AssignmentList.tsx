import React, { useEffect, useState, useContext } from 'react';
import { FirebaseProps } from '../types/PropInterfaces';
import { withFirebaseHOC } from '../firebase';
import {
  makeStyles,
  Button,
  colors,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { GradingContext } from './GradingContext';
import { AuthContext } from './AuthContext';
import AddAssignmentForm from './AddAssignmentModal';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    fontSize: '1.4rem',
    backgroundColor: colors.blueGrey[800],
    color: '#fff',
  },
  selected: {
    margin: theme.spacing(2),
    fontSize: '2rem',
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
}));

const ClassList: React.FC<FirebaseProps> = ({ firebase }) => {
  const { assignment, setAssignment } = useContext(GradingContext);
  const { isTeacher } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    async function getAssignments() {
      const assignments = await firebase.getAssignments('7th');
      setAssignments(assignments);
    }
    getAssignments();
  }, [firebase]);
  const classes = useStyles();
  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Expansion Panel 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ul className={classes.list}>
            {assignments.map((a) => {
              return a === assignment ? (
                <li>
                  <Button className={classes.selected} key={a} onClick={() => setAssignment(a)}>
                    {a}
                  </Button>
                </li>
              ) : (
                <li>
                  <Button className={classes.root} key={a} onClick={() => setAssignment(a)}>
                    {a}
                  </Button>
                </li>
              );
            })}
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {isTeacher && <AddAssignmentForm />}
    </>
  );
};

export default withFirebaseHOC(ClassList);
