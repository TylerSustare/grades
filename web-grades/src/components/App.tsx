import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import './App.css';
import { AuthProvider } from './Auth';
import C from './C';
import Login from './Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={C} />
        </>
      </Router>
    </AuthProvider>
  );
};

export default App;
