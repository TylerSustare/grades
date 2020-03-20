import { IFirebase } from '../firebase/firebase';
import { History } from 'history';

export interface FirebaseWithRouterProps extends FirebaseProps {
  history: History;
}

export interface FirebaseProps {
  firebase: IFirebase;
}
