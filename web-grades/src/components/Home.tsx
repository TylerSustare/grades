import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import TopAppBar from './TopAppBar';
import AssignmentList from './AssignmentList';
import AssignmentGrading from './AssignmentGrading';
import { GradingProvider } from './GradingContext';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';

const Home: React.FC<FirebaseProps> = ({ firebase }) => {
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
    <>
      <TopAppBar />
      <GradingProvider>
        <div className="container">
          <div className="left">
            <AssignmentList />
          </div>
          <div className="right">{isTeacher ? <AssignmentGrading /> : <AssignmentSubmissionForm />}</div>
        </div>
      </GradingProvider>
    </>
  );
};

export default withFirebaseHOC(Home);
