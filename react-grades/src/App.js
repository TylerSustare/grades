import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Home} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
