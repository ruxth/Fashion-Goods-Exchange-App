import { useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, View } from "react-native";

import SignUpForm from "./SignUpForm";

function SignUpAuth({ isLogin, onAuthenticate }) {
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
    username: false,
  });

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword, username, imageURI } =
      credentials;

    email = email.trim();
    password = password.trim();
    username = username.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;
    const usernameIsValid = username !== "";

    const loginEmailIsValid = email !== "";
    const loginPasswordIsValid = password !== "";

    if (isLogin) {
      if (!loginEmailIsValid || !loginPasswordIsValid) {
        Alert.alert(
          "Invalid Input",
          "Please check that you have entered all the details."
        );
        setCredentialsInvalid({
          email: !emailIsValid,
          password: !passwordIsValid,
        });
        return;
      }
      onAuthenticate({ email, password });
    } else {
      if (!emailIsValid || !passwordIsValid || !usernameIsValid) {
        Alert.alert(
          "Invalid input",
          "Please check that you have entered all the details."
        );
        setCredentialsInvalid({
          email: !emailIsValid,
          confirmEmail: !emailIsValid || !emailsAreEqual,
          password: !passwordIsValid,
          confirmPassword: !passwordIsValid || !passwordsAreEqual,
          username: !usernameIsValid,
        });
        return;
      } else if (!emailsAreEqual) {
        Alert.alert(
          "Email does not match",
          "Please check your entered credentials."
        );
        setCredentialsInvalid({
          confirmEmail: !emailIsValid || !emailsAreEqual,
        });
        return;
      } else if (!passwordsAreEqual) {
        Alert.alert(
          "Password does not match",
          "Please check your entered credentials."
        );
        setCredentialsInvalid({
          confirmPassword: !passwordIsValid || !passwordsAreEqual,
        });
        return;
      }
      onAuthenticate({ email, password, username, imageURI });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SignUpForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </KeyboardAvoidingView>
  );
}

export default SignUpAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
