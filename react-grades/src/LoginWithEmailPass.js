import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app, { firebase } from "./base.js";
import { AuthContext } from "./Auth.js";

const Login = ({ history }) => {
  const handleGoogle = useCallback(
    async e => {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      await app.auth().signInWithPopup(googleProvider);
      history.push("/");
    },
    [history]
  );
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in With Google</h1>
      <button onClick={handleGoogle}>Google</button>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
