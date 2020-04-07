import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseProvider } from './firebase';
import * as Sentry from '@sentry/browser';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://ebec230e71ab4dff9014f2228fd3a175@o206408.ingest.sentry.io/5191608' });
}

ReactDOM.render(
  <FirebaseProvider value={Firebase}>
    <App />
  </FirebaseProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
