import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app, { firebase } from "./base";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const handleGoogle = useCallback(
    async e => {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      await app.auth().signInWithPopup(googleProvider);
      history.push("/");
    },
    [history]
  );

  return (
    <div>
      <h1>Sign up</h1>
      <button onClick={handleGoogle}>goog</button>
      <form onSubmit={handleSignUp}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
