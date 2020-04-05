import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FirebaseProps } from '../types/PropInterfaces';
import TopAppBar from './TopAppBar';
import AssignmentList from './AssignmentList';
import AssignmentGrading from './AssignmentGrading';
import { GradingProvider } from './GradingContext';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';
import Grid from '@material-ui/core/Grid';

const Home: React.FC<FirebaseProps> = () => {
  const { isTeacher, currentUser } = useContext(AuthContext);
  if (!currentUser.email.includes('@saints.org') && !currentUser.email.includes('sustare@gmail.com')) {
    return (
      <div>
        <TopAppBar />
        <h2>Please log in with your Trinity Account '@saints.org'</h2>
      </div>
    );
  }

  return (
    <GradingProvider>
      <Grid container spacing={2}>
        <TopAppBar />
        <Grid item xs={12} sm={12} md={3}>
          <AssignmentList />
        </Grid>
        <Grid item xs={12} sm={12} md={9}>
          {isTeacher ? <AssignmentGrading /> : <AssignmentSubmissionForm />}
        </Grid>
      </Grid>
    </GradingProvider>
  );
};

export default Home;
