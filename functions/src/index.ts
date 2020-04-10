import * as _ from 'lodash';
import * as mail from '@sendgrid/mail';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();
// https://firebase.google.com/docs/functions/config-env
// https://firebase.google.com/docs/functions/typescript

mail.setApiKey(functions.config().sg.key);
export const feedback = functions.firestore
  .document('/classes/{classId}/assignments/{assignmentId}/submissions/{submissionId}')
  .onUpdate(async (change, context) => {
    try {
      const { after: afterSnapshot, before: beforeSnapshot } = change;
      const before = beforeSnapshot.data();
      const after = afterSnapshot.data();
      if (
        // before and after comments are defined
        !_.isNil(before?.teacherComment) &&
        !_.isNil(after?.teacherComment) &&
        // before and after aren't equal
        before?.teacherComment !== after?.teacherComment &&
        // the comment isn't being deleted
        !_.isEmpty(after?.teacherComment)
      ) {
        const { params } = context;
        let primaryGradingTeachers = '';
        const classSnapshot = await admin.firestore().collection('classes').doc(params?.classId).get();
        const classData = classSnapshot.data();
        const teachers = classData?.teachers;

        for (const teacherEmail in teachers) {
          if (teachers.hasOwnProperty(teacherEmail) && teachers[teacherEmail]?.grader) {
            primaryGradingTeachers += ` ${teachers[teacherEmail].nameToStudents} (${teacherEmail}) `;
          }
        }

        const msg = {
          to: after?.email,
          from: `${params?.classId} Grade Assignments<support@sustare.com>`,
          subject: `Your ${params?.classId} Grade teacher left you feedback on the assignment ${params?.assignmentId} 🎉`,
          text: `The feedback for assignment ${params?.assignmentId} is: ${after?.teacherComment}. 
            Head over to https://assignments.sustare.com to update your assignment if you need to update anything.`,
          html: `<h3>The feedback for assignment ${params?.assignmentId}</h3>
                 <h2>${after?.teacherComment}</h2>
                 <p>Please send any updates to <bold>${primaryGradingTeachers}</bold> if needed.</p>
          `,
        };

        await mail.send(msg);
      }
    } catch (error) {
      console.error('error', JSON.stringify(error, null, 2));
    }
  });
