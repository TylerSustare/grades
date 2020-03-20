// https://levelup.gitconnected.com/how-to-use-the-react-context-api-to-build-react-native-expo-and-firebase-apps-adda840e52b0
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export type firebaseUser = firebase.User;

export interface IFirebase {
  loginWithEmail: Function;
  signupWithEmail: Function;
  signOut: Function;
  googleAuth: Function;
  checkUserAuth: Function;
  createNewUser: Function;
  getNewUser: Function;
}

const Firebase: IFirebase = {
  // auth
  loginWithEmail: (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> =>
    firebase.auth().signInWithEmailAndPassword(email, password),

  signupWithEmail: (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> =>
    firebase.auth().createUserWithEmailAndPassword(email, password),

  signOut: (): Promise<void> => firebase.auth().signOut(),

  googleAuth: (): Promise<firebase.auth.UserCredential> => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider);
  },

  checkUserAuth: (user) => firebase.auth().onAuthStateChanged(user),

  // firestore
  createNewUser: (name: string): Promise<void> => {
    if (name.length === 0) {
      return;
    }
    return firebase
      .firestore()
      .collection('users')
      .doc(name)
      .set({ name });
  },

  getNewUser: (name: string) => {
    if (name.length === 0) {
      return;
    }
    firebase
      .firestore()
      .collection('users')
      .doc(name)
      .get();
  }
};

export default Firebase;
