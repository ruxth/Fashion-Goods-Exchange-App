import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

import SignUpTitle from "./SignUpTitle";
import CornerButton from "../CornerButton";
import Input from "../Input";
import SignupInput from "../ui/SignupInput";

const profileForm = ({ onAuthenticate }) => {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  function updateInputValueHandler(enteredValue) {
    setEnteredUsername(enteredValue);
    setUsernameIsValid(enteredValue.trim() !== "");
  }

  function submitHandler() {
    const username = enteredUsername.trim();

    if (!usernameIsValid) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      return;
    }

    onAuthenticate({ username });
  }

  return (
    <View style={styles.container}>
      <View style={styles.signupContainer}>
        <SignUpTitle title="Profile Set Up" />

        <SignupInput
          textInputConfig={{
            onChangeText: updateInputValueHandler.bind(this, "username"),
            value: enteredUsername,
            isInvalid: !usernameIsValid,
            placeholder: "Username",
          }}
        />
        <CornerButton title="Next" onPress={submitHandler} />
      </View>
    </View>
  );
};

export default profileForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  signupContainer: {
    marginHorizontal: 25,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
