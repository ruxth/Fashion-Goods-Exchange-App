import { View, StyleSheet, Image } from "react-native";
import RoundButton from "../Components/RoundButton";

const StartingScreen = ({ navigation }) => {
  function loginHandler() {
    navigation.navigate("LoginScreen");
  }

  function signupHandler() {
    navigation.navigate("SignUpScreen");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../util/images/ZERO.png")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <RoundButton
          title="LOGIN"
          containerStyle={styles.loginContainer}
          textStyle={styles.loginText}
          onPress={loginHandler}
        />
        <RoundButton
          title="SIGN UP"
          containerStyle={styles.signupContainer}
          onPress={signupHandler}
        />
      </View>
    </View>
  );
};

export default StartingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C3DFB9",
    flex: 1,
  },

  logoContainer: {
    height: 30,
    position: "absolute",
    top: "50%",
    left: "37%",
  },

  logo: {
    height: "100%",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 25,
    marginBottom: 40,
  },

  loginContainer: {
    backgroundColor: "#77976B",
  },
  loginText: {
    color: "#fff",
  },

  signupContainer: {
    backgroundColor: "#fff",
  },
});
