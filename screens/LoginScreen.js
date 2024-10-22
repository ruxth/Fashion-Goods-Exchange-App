import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useContext, useState } from "react";

import SignUpAuth from "../Components/SignUp/SignUpAuth";
import LoadingOverlay from "../Components/ui/LoadingOverlay";
import { login } from "../util/auth";
import { AuthContext } from "../store/auth-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { useDispatch } from "react-redux";
import { setUser } from "../store/redux/userAuth";
import SignUpTitle from "../Components/SignUp/SignUpTitle";
function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const dispatch = useDispatch();

  async function loginHandler({ email, password }) {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCred) => {
        if (userCred) {
          getDoc(doc(firestoreDB, "users", userCred?.user.uid)).then(
            (docSnap) => {
              if (docSnap.exists()) {
                data = docSnap.data();
                dispatch(setUser(data));
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log("Error :", err.message);
        Alert.alert(
          "Incorrect email or password",
          "Please enter the correct details."
        );
      });
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <View style={styles.container}>
      <SignUpTitle title="Login" style={styles.title} />
      <SignUpAuth isLogin onAuthenticate={loginHandler} />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 20,
  },

  title: {
    paddingLeft: 30,
    paddingVertical: 10,
  },
});
