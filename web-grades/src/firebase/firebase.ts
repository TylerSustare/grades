// https://levelup.gitconnected.com/how-to-use-the-react-context-api-to-build-react-native-expo-and-firebase-apps-adda840e52b0
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { AssignmentSubmission } from '../types/FirebaseModels';
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export type firebaseUser = firebase.User;
type firestoreDocument = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export interface IFirebase {
  loginWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signupWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
  googleAuth: () => Promise<firebase.auth.UserCredential>;
  checkUserAuth: Function;
  createNewUser: (name: string) => Promise<void>;
  getNewUser: (name: string) => Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
  getAssignments: (classId: string) => Promise<string[]>;
  getAssignmentSubmissions: (classId: string, assignmentId: string) => Promise<AssignmentSubmission[]>;
  submitAssignmentToClass: (classId: string, assignmentId: string) => Promise<void>;
  getAssignmentByStudentEmail: (
    classId: string,
    assignmentId: string,
    studentEmail: string
  ) => Promise<AssignmentSubmission>;
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
      email: user.user.email
    };
    await firebase
      .firestore()
      .collection('users')
      .doc(user.user.email)
      .set(userStuff);
    return user;
  },

  checkUserAuth: (user) => firebase.auth().onAuthStateChanged(user),

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

  submitAssignmentToClass: async (classId: string, assignmentId: string): Promise<void> => {}
};

export default Firebase;
