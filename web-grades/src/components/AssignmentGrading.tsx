import React, { useContext, useState, useEffect } from 'react';
import { withFirebaseHOC } from '../firebase';
import { FirebaseProps } from '../types/PropInterfaces';
import { GradingContext } from './GradingContext';
import { AssignmentSubmission } from '../types/FirebaseModels';
import TeacherResponseForm from './TeacherResponseForm';

const AssignmentGrading: React.FC<FirebaseProps> = ({ firebase }) => {
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([] as AssignmentSubmission[]);

  const { assignment } = useContext(GradingContext);
  useEffect(() => {
    async function getAssignments() {
      const assignments = await firebase.getAssignmentSubmissions('7th', assignment);
      setAssignmentSubmissions(assignments);
    }
    getAssignments();
  }, [firebase, assignment]);
  return (
    <>
      <h2>{assignment}</h2>
      {assignment && assignmentSubmissions && assignmentSubmissions.length > 0 ? (
        assignmentSubmissions.map((a) => {
          return (
            <TeacherResponseForm
              key={`${assignment}-${a.email}`}
              assignment={assignment}
              email={a.email}
              score={a.score}
              studentComment={a.studentComment}
              teacherComment={a.teacherComment}
              files={a.files}
              studentId={a.studentId}
            />
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default withFirebaseHOC(AssignmentGrading);
