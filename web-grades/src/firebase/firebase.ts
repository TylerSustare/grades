// https://levelup.gitconnected.com/how-to-use-the-react-context-api-to-build-react-native-expo-and-firebase-apps-adda840e52b0
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './firebaseConfig';
import {
  AssignmentSubmission,
  IAssignmentSubmission,
  IUser,
  IDisplayAssignment,
  IFirebaseAssignment,
  IGroupAssignmentsByDueAtLocalDateString,
  FileParams,
  FileUrlAndType,
} from '../types/FirebaseModels';
import groupBy from 'lodash/groupBy';

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export type firebaseUser = firebase.User;
type firestoreDocument = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
type firestoreQuery = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFirebase {
  //#region auth
  loginWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signupWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
  googleAuth: () => Promise<firebase.auth.UserCredential>;
  checkUserAuth: Function;
  //#endregion
  //#region storage
  uploadFileToAssignment: (options: FileParams) => Promise<void>;
  getFilesForAssignment: (gradeId: string, assignmentId: string, studentUid: string, fileIds: string[]) => Promise<any>;
  //#endregion
  //#region firebase
  // users
  createNewUser: (user: IUser) => Promise<void>;
  getUser: (name: string) => Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
  // get assignments
  getAssignments: (classId: string, orderBy: 'asc' | 'desc') => Promise<IGroupAssignmentsByDueAtLocalDateString>;
  subscribeToAssignments: (classId: string, orderBy: 'asc' | 'desc', setState: Function) => () => void;
  subscribeToVisibleToStudentAssignments: (classId: string, orderBy: 'asc' | 'desc', setState: Function) => () => void;
  getAssignmentSubmissions: (classId: string, assignmentId: string) => Promise<AssignmentSubmission[]>;
  mapAssignmentsToLocalDateObjects: (querySnapshot: firestoreQuery) => IGroupAssignmentsByDueAtLocalDateString;
  getAssignmentByStudentEmail: (
    classId: string,
    assignmentId: string,
    studentEmail: string
  ) => Promise<AssignmentSubmission>;
  // submit assignments
  submitAssignmentToClass: (classId: string, assignmentId: string, submission: AssignmentSubmission) => Promise<void>;
  createNewAssignment: (classId: string, assignmentId: string, dueDate: Date) => Promise<void>;
  getTeacherList: (classId: string) => Promise<string[]>;
  toggleHiddenAssignment: (classId: string, assignmentId: string) => Promise<any>;
  //#endregion
}

const Firebase: IFirebase = {
  //#region auth
  loginWithEmail: (email: string, password: string): Promise<firebase.auth.UserCredential> =>
    firebase.auth().signInWithEmailAndPassword(email, password),

  signupWithEmail: (email: string, password: string): Promise<firebase.auth.UserCredential> =>
    firebase.auth().createUserWithEmailAndPassword(email, password),

  signOut: (): Promise<void> => firebase.auth().signOut(),

  googleAuth: async (): Promise<firebase.auth.UserCredential> => {
    // signin with google
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const user = await firebase.auth().signInWithPopup(googleProvider);
    // save user in DB
    const userStuff: IUser = {
      uid: user.user.uid,
      displayName: user.user.displayName,
      photoURL: user.user.photoURL,
      email: user.user.email,
      lastLoggedIn: new Date(),
    };
    await Firebase.createNewUser(userStuff);
    return user;
  },

  checkUserAuth: (user) => firebase.auth().onAuthStateChanged(user),
  //#endregion

  //#region storage
  uploadFileToAssignment: (options: FileParams): Promise<void> => {
    const { file, classId, assignmentId, studentUid, fileId } = options;
    const ref = firebase.storage().ref(`${classId}/${assignmentId}/${studentUid}/${fileId}`);
    return ref.put(file).then((snapshot) => snapshot);
  },

  getFilesForAssignment: async (
    gradeId: string,
    assignmentId: string,
    studentUid: string,
    fileIds: string[]
  ): Promise<any> => {
    try {
      const downloadUrls: FileUrlAndType[] = [];
      if (!gradeId || !assignmentId || !studentUid || !fileIds || fileIds.length === 0) {
        return downloadUrls;
      }
      for (const i of fileIds) {
        const path = `${gradeId}/${assignmentId}/${studentUid}/${i}`;
        const ref = firebase.storage().ref(path);
        const metadata = await ref.getMetadata();
        const returnObject: FileUrlAndType = {
          fileUrl: await ref.getDownloadURL(),
          fileType: metadata?.contentType,
        };
        downloadUrls.push(returnObject);
      }
      return downloadUrls;
    } catch (error) {
      return '';
    }
  },
  //#endregion

  //#region firestore
  //#region users
  createNewUser: async (user: IUser): Promise<void> => {
    await firebase.firestore().collection('users').doc(user.uid).set(user);
  },

  getUser: (uid: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> => {
    if (uid.length === 0) {
      return;
    }
    return firebase.firestore().collection('users').doc(uid).get();
  },
  //#endregion

  //#region get assignments
  mapAssignmentsToLocalDateObjects: (querySnapshot: firestoreQuery): IGroupAssignmentsByDueAtLocalDateString => {
    const assignments: IDisplayAssignment[] = querySnapshot.docs.map((d) => {
      const { name, createdAt, dueAt, isVisibleToStudents } = d.data() as IFirebaseAssignment;
      return {
        isVisibleToStudents,
        name,
        createdAt: createdAt.toDate().toLocaleDateString(),
        dueAt: dueAt.toDate().toLocaleDateString(),
      };
    });

    const groupedBy: IGroupAssignmentsByDueAtLocalDateString = groupBy(assignments, 'dueAt');
    return groupedBy;
  },

  getAssignments: async (
    classId: string,
    orderBy: 'asc' | 'desc'
  ): Promise<IGroupAssignmentsByDueAtLocalDateString> => {
    const assignmentQuery: firestoreQuery = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .orderBy('dueAt', orderBy)
      .get();

    return Firebase.mapAssignmentsToLocalDateObjects(assignmentQuery);
  },

  subscribeToAssignments: (classId: string, orderBy: 'asc' | 'desc', setState: Function): (() => void) => {
    // this function returns an unsubscribe function that takes no arguments and returns void `() => void`
    const unsubscribe = firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .orderBy('dueAt', orderBy)
      .onSnapshot(
        function onNext(snapshot: firestoreQuery) {
          const groupedBy = Firebase.mapAssignmentsToLocalDateObjects(snapshot);
          setState(groupedBy);
        },
        function onError(error: Error) {
          console.error('Error getting snapshot on subscribe to assignments');
          console.error(error);
        }
      );
    return unsubscribe;
  },

  subscribeToVisibleToStudentAssignments: (
    classId: string,
    orderBy: 'asc' | 'desc',
    setState: Function
  ): (() => void) => {
    const unsubscribe = firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .where('isVisibleToStudents', '==', true)
      .orderBy('dueAt', orderBy)
      .onSnapshot(
        function onNext(snapshot: firestoreQuery) {
          const groupedBy = Firebase.mapAssignmentsToLocalDateObjects(snapshot);
          setState(groupedBy);
        },
        function onError(error: Error) {
          console.error('Error getting snapshot on subscribe to assignments');
          console.error(error);
        }
      );
    return unsubscribe;
  },

  getAssignmentSubmissions: async (classId: string, assignmentId: string): Promise<AssignmentSubmission[]> => {
    if (!classId || !assignmentId) {
      return [];
    }
    const submissionQuery: firestoreQuery = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .collection('submissions')
      .orderBy('studentLastName')
      .get();

    return submissionQuery.docs.map((doc) => new AssignmentSubmission(doc.data() as IAssignmentSubmission));
  },

  getAssignmentByStudentEmail: async (
    classId: string,
    assignmentId: string,
    studentEmail: string
  ): Promise<AssignmentSubmission> => {
    if (!assignmentId || !classId || !studentEmail) {
      return {} as AssignmentSubmission;
    }
    try {
      const submissionQuery: firestoreQuery = await firebase
        .firestore()
        .collection('classes')
        .doc(classId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .where('email', '==', studentEmail)
        .limit(1)
        .get();

      return new AssignmentSubmission(submissionQuery.docs[0].data() as IAssignmentSubmission);
    } catch (error) {
      console.error('error', error);
      return {} as AssignmentSubmission;
    }
  },
  //#endregion

  //#region create assignments
  submitAssignmentToClass: async (
    classId: string,
    assignmentId: string,
    submission: AssignmentSubmission
  ): Promise<void> => {
    // get assignment
    // TODO: transaction
    const submissionQuery: firestoreQuery = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .collection('submissions')
      .where('email', '==', submission.email)
      .limit(1)
      .get();

    // firebase.firestore().runTransaction((transaction: firebase.firestore.Transaction) => { });
    const assignmentDocument = submissionQuery.docs[0];
    const assignmentData = assignmentDocument.data() as AssignmentSubmission;
    submission.files.push(...assignmentData.files);
    // names for submissions shouldn't change
    submission.studentFirstName = assignmentData.studentFirstName;
    submission.studentLastName = assignmentData.studentLastName;

    const vanillaSub = Object.assign({}, submission); // must be a vanilla JS object for firestore

    // save back to database
    return firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .collection('submissions')
      .doc(assignmentDocument.id)
      .set(vanillaSub);
  },

  createNewAssignment: async (classId: string, assignmentId: string, dueDate: Date): Promise<void> => {
    if (!classId || !assignmentId) {
      return;
    }
    const studentsDoc: firestoreDocument = await firebase.firestore().collection('classes').doc(classId).get();

    const classObject = studentsDoc.data();
    const studentsByEmailObject = classObject['students'];
    const studentsEmailArray: string[] = Object.keys(studentsByEmailObject);
    const submissionObjectArray = studentsEmailArray.map((email: string) =>
      Object.assign(
        {},
        new AssignmentSubmission({
          email: email,
          studentFirstName: studentsByEmailObject[email].firstName,
          studentLastName: studentsByEmailObject[email].lastName,
        })
      )
    );

    // create document
    await firebase.firestore().collection('classes').doc(classId).collection('assignments').doc(assignmentId).set({
      isVisibleToStudents: true, // TODO: make this an option
      createdAt: new Date(),
      dueAt: dueDate,
      name: assignmentId,
    });

    // add submission for each student
    // TODO: use a batch write
    for (let i = 0; i < submissionObjectArray.length; i++) {
      await firebase
        .firestore()
        .collection('classes')
        .doc(classId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .add(submissionObjectArray[i]);
    }
  },

  getTeacherList: async (classId: string): Promise<string[]> => {
    const classDoc: firestoreDocument = await firebase.firestore().collection('classes').doc(classId).get();
    const teachersObject = classDoc.data().teachers;
    return Object.keys(teachersObject);
  },

  toggleHiddenAssignment: async (classId: string, assignmentId: string): Promise<void> => {
    const assignment: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .get();
    const assignmentData = assignment.data() as IFirebaseAssignment;
    const { isVisibleToStudents: isVis } = assignmentData;

    return firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .update({ isVisibleToStudents: !isVis });
  },
  //#endregion
  //#endregion
};

export default Firebase;
