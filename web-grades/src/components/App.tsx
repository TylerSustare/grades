/**
 * https://codesandbox.io/s/github/mui-org/material-ui/tree/master/examples/create-react-app
 */
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Home from './Home';
import theme from '../theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Home} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
