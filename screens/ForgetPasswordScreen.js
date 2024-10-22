import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import SignupInput from "../Components/ui/SignupInput";
import SignUpTitle from "../Components/SignUp/SignUpTitle";
import { GlobalStyles } from "../constants/styles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

function ForgetPasswordScreen() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const auth = getAuth();
  const navigation = useNavigation();

  function handleInputChange(text) {
    setEnteredEmail(text);
  }

  const passwordResetHandle = async () => {
    try {
      await sendPasswordResetEmail(auth, enteredEmail);
      Alert.alert("Password Reset Link Sent");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.signupContainer}>
        <SignUpTitle title="Forget Password" style={styles.title} />
        <SignupInput
          textInputConfig={{
            value: enteredEmail,
            keyboardType: "email-address",
            isInvalid: emailIsInvalid,
            placeholder: "Email",
            onChangeText: handleInputChange,
          }}
        />
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={passwordResetHandle}
        >
          <Text style={styles.input}>Send password reset link</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  signupContainer: {
    marginHorizontal: 25,
    paddingTop: 25,
  },
  title: {
    paddingVertical: 10,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  input: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 15,
  },
});
