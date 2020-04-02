// https://levelup.gitconnected.com/how-to-use-the-react-context-api-to-build-react-native-expo-and-firebase-apps-adda840e52b0
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './firebaseConfig';
import { AssignmentSubmission, IAssignmentSubmission } from '../types/FirebaseModels';
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export type firebaseUser = firebase.User;
type firestoreDocument = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
type firestoreQuery = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

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
  getUser: (name: string) => Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
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
      .doc(user.user.uid)
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
  createNewUser: (uid: string): Promise<void> => {
    if (uid.length === 0) {
      return;
    }
    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .set({ uid });
  },

  getUser: (uid: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> => {
    if (uid.length === 0) {
      return;
    }
    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
  },

  getAssignments: async (classId: string): Promise<string[]> => {
    const assignmentQuery: firestoreQuery = await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .get();

    // TODO: return due dates too
    const assignments = assignmentQuery.docs.map((d) => d.id);

    return assignments;
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
      .get();

    return submissionQuery.docs.map((d) => new AssignmentSubmission(d.data() as IAssignmentSubmission));
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
      console.error(error);
      return {} as AssignmentSubmission;
    }
  },

  submitAssignmentToClass: async (
    classId: string,
    assignmentId: string,
    submission: AssignmentSubmission
  ): Promise<void> => {
    // get assignment
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

  createNewAssignment: async (classId: string, assignmentId: string): Promise<any> => {
    if (!classId || !assignmentId) {
      return;
    }
    const studentsDoc: firestoreDocument = await firebase
      .firestore()
      .collection('users')
      .doc(classId)
      .get();

    const studentsByClassObject = studentsDoc.data();
    const studentsArray: [] = studentsByClassObject['students'];
    const submissionObjectArray = studentsArray.map((s) => Object.assign({}, new AssignmentSubmission({ email: s })));

    // create document
    await firebase
      .firestore()
      .collection('classes')
      .doc(classId)
      .collection('assignments')
      .doc(assignmentId)
      .set({ createdAt: new Date() });

    // add submission for each student
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
};

export default Firebase;
