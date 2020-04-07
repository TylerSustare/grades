import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FirebaseProps } from '../types/PropInterfaces';
import TopAppBar from './TopAppBar';
import AssignmentList from './AssignmentList';
import AssignmentGrading from './AssignmentGrading';
import { GradingProvider } from './GradingContext';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';
import Grid from '@material-ui/core/Grid';
import { TeacherContext } from './TeacherContext';

const Home: React.FC<FirebaseProps> = () => {
  const { currentUser } = useContext(AuthContext);
  const { isTeacher } = useContext(TeacherContext);
  // TODO: use `org` emails on school/organization level
  if (!currentUser.email.includes('@saints.org') && !currentUser.email.includes('sustare@gmail.com')) {
    return (
      <div>
        <TopAppBar />
        <h2>Please log in with your School Account</h2>
      </div>
    );
  }

  return (
    <GradingProvider>
      <Grid container>
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
