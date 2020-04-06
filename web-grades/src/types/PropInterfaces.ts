import { IFirebase } from '../firebase/firebase';
import { History } from 'history';

export interface FirebaseProps {
  firebase: IFirebase;
}

export interface FirebaseWithRouterProps extends FirebaseProps {
  history: History;
}

export interface FirebaseWithChildrenProps extends FirebaseProps {
  children: React.ReactChildren;
}
