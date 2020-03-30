// https://levelup.gitconnected.com/how-to-use-the-react-context-api-to-build-react-native-expo-and-firebase-apps-adda840e52b0
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './firebaseConfig';
import { AssignmentSubmission } from '../types/FirebaseModels';
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export type firebaseUser = firebase.User;
type firestoreDocument = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export interface filePrams {
  classId: string;
  assignmentId: string;
  studentUid: string;
  file: File;
  fileId: string;
}

export interface fileUrlAndType {
  fileUrl: string;
  fileType: string | undefined;
}

export interface IFirebase {
  // auth
  loginWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signupWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
  googleAuth: () => Promise<firebase.auth.UserCredential>;
  checkUserAuth: Function;
  //storage
  uploadFileToAssignment: (options: filePrams) => Promise<void>;
  getFilesForAssignment: (gradeId: string, assignmentId: string, studentUid: string, fileIds: string[]) => Promise<any>;
  // firebase
  createNewUser: (name: string) => Promise<void>;
  getNewUser: (name: string) => Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
  getAssignments: (classId: string) => Promise<string[]>;
  getAssignmentSubmissions: (classId: string, assignmentId: string) => Promise<AssignmentSubmission[]>;
  submitAssignmentToClass: (classId: string, assignmentId: string, submission: AssignmentSubmission) => Promise<void>;
  getAssignmentByStudentEmail: (
    classId: string,
    assignmentId: string,
    studentEmail: string
  ) => Promise<AssignmentSubmission>;
  createNewAssignment: (classId: string, assignmentId: string) => Promise<void>;
}
const Firebase: IFirebase = {
  // auth
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
    const userStuff = {
      uid: user.user.uid,
      displayName: user.user.displayName,
      photoURL: user.user.photoURL,
      email: user.user.email,
    };
    await firebase
      .firestore()
      .collection('users')
      .doc(user.user.email)
      .set(userStuff);
    return user;
  },

  checkUserAuth: (user) => firebase.auth().onAuthStateChanged(user),

  // storage

  uploadFileToAssignment: (options: filePrams): Promise<void> => {
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
      const downloadUrls: fileUrlAndType[] = [];
      if (!gradeId || !assignmentId || !studentUid || !fileIds || fileIds.length === 0) {
        return downloadUrls;
      }
      for (const i of fileIds) {
        const path = `${gradeId}/${assignmentId}/${studentUid}/${i}`;
        const ref = firebase.storage().ref(path);
        const metadata = await ref.getMetadata();
        const returnObject: fileUrlAndType = {
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

  // firestore
  createNewUser: (email: string): Promise<void> => {
    if (email.length === 0) {
      return;
    }
    return firebase
      .firestore()
      .collection('users')
      .doc(email)
      .set({ email });
  },

  getNewUser: (email: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> => {
    if (email.length === 0) {
      return;
    }
    return firebase
      .firestore()
      .collection('users')
      .doc(email)
      .get();
  },

  getAssignments: async (classId: string): Promise<string[]> => {
    const classDoc: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .get();

    const values = classDoc.data(); // gets the value of the query
    if (!values) {
      return [];
    }
    const assignments = Object.keys(values);
    return assignments;
  },

  getAssignmentSubmissions: async (classId: string, assignmentId: string): Promise<AssignmentSubmission[]> => {
    const classDoc: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .get();

    const values = classDoc.data();
    if (!values) {
      return [];
    }
    const assignment = values[assignmentId];
    return assignment;
  },

  getAssignmentByStudentEmail: async (
    classId: string,
    assignmentId: string,
    studentEmail: string
  ): Promise<AssignmentSubmission> => {
    const classDoc: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .get();

    const values = classDoc.data();
    const assignment: AssignmentSubmission[] = values[assignmentId];
    if (!assignment) {
      return {} as AssignmentSubmission;
    }
    return assignment.filter((a) => a.email === studentEmail)[0];
  },

  submitAssignmentToClass: async (
    classId: string,
    assignmentId: string,
    submission: AssignmentSubmission
  ): Promise<void> => {
    // get assignment
    const classDoc: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .get();

    const values = classDoc.data();
    // find if this is an update or new submission
    const assignment: AssignmentSubmission[] = values[assignmentId];

    for (let i = 0; i < assignment.length; i++) {
      if (submission.email === assignment[i].email) {
        submission.files.push(...assignment[i].files);
        assignment[i] = Object.assign({}, submission);
        return firebase
          .firestore()
          .collection('classes')
          .doc(classId)
          .set(values);
      }
    }

    const vanillaSub = Object.assign({}, submission); // must be a vanilla JS object for firestore
    assignment.push(vanillaSub);

    // save back to database
    return firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .set(values);
  },

  createNewAssignment: async (classId: string, assignmentId: string): Promise<void> => {
    if (classId.length === 0 || assignmentId.length === 0) {
      return;
    }
    // get all assignments as class object
    const classDoc: firestoreDocument = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .get();

    const classObject = classDoc.data();

    const studentsDoc: firestoreDocument = await firebase
      .firestore()
      .collection('users')
      .doc(classId)
      .get();

    const studentsByClassObject = studentsDoc.data();
    const studentsArray: [] = studentsByClassObject['students'];
    const submissionObjectArray = studentsArray.map((s) => Object.assign({}, new AssignmentSubmission({ email: s })));
    classObject[assignmentId] = submissionObjectArray;

    // save back to database
    return firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .set(classObject);
  },
};

export default Firebase;
