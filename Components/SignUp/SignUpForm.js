import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import SignUpTitle from "./SignUpTitle";
import CornerButton from "../CornerButton";
import Input from "../Input";
import SignupInput from "../ui/SignupInput";
import { useNavigation } from "@react-navigation/native";
import ImagePickerComponent from "../ImagePicker";
import { GlobalStyles } from "../../constants/styles";
import RoundButton from "../RoundButton";

const SignUpForm = ({ isLogin, onSubmit, credentialsInvalid }) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [enteredUsername, setEnteredUsername] = useState("");
  const [pickedImage, setPickedImage] = useState();

  const navigation = useNavigation();

  function forgetPasswordHandler() {
    navigation.navigate("ForgetPasswordScreen");
  }

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
    username: usernameIsValid,
  } = credentialsInvalid || {};

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
      case "username":
        setEnteredUsername(enteredValue);
        break;
    }
  }

  async function uploadImageHandler() {
    const image = await ImagePicker.launchImageLibraryAsync({
      aspect: [1, 1],
      quality: 0.5,
      allowsEditing: true,
    });
    setPickedImage(image.assets[0].uri);
  }

  let imagePreview = <Text>No image selected.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
      username: enteredUsername,
      imageURI: pickedImage,
    });
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.signupContainer}>
        {!isLogin && (
          <>
            <View style={styles.container}>
              <View style={styles.imagePreview}>{imagePreview}</View>

              <RoundButton
                title="Upload Image"
                onPress={uploadImageHandler}
                containerStyle={styles.roundButtonContainer}
              />
            </View>
            <SignupInput
              textInputConfig={{
                onChangeText: updateInputValueHandler.bind(this, "username"),
                value: enteredUsername,
                isInvalid: usernameIsValid,
                placeholder: "Username",
              }}
            />
          </>
        )}
        <SignupInput
          textInputConfig={{
            value: enteredEmail,
            keyboardType: "email-address",
            isInvalid: emailIsInvalid,
            placeholder: "Email",
            onChangeText: updateInputValueHandler.bind(this, "email"),
          }}
        />
        {!isLogin && (
          <SignupInput
            textInputConfig={{
              onChangeText: updateInputValueHandler.bind(this, "confirmEmail"),
              value: enteredConfirmEmail,
              keyboardType: "email-address",
              isInvalid: emailsDontMatch,
              placeholder: "Confirm Email",
            }}
          />
        )}
        <SignupInput
          textInputConfig={{
            onChangeText: updateInputValueHandler.bind(this, "password"),
            value: enteredPassword,
            isInvalid: passwordIsInvalid,
            placeholder: "Password",
            secureTextEntry: true,
          }}
        />
        {!isLogin && (
          <SignupInput
            textInputConfig={{
              onChangeText: updateInputValueHandler.bind(
                this,
                "confirmPassword"
              ),
              value: enteredConfirmPassword,
              isInvalid: passwordsDontMatch,
              placeholder: "Confirm Password",
              secureTextEntry: true,
            }}
          />
        )}
        {isLogin && (
          <TouchableOpacity
            style={styles.forgetContainer}
            onPress={forgetPasswordHandler}
          >
            <Text style={styles.forgetText}>Forget Password?</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {/* {isLogin ? (
          <CornerButton title="Next" onPress={loginsubmitHandler} />
        ) : (
          <CornerButton title="Next" onPress={submitHandler} />
        )} */}
        <CornerButton title="Next" onPress={submitHandler} />
      </View>
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },

  container: {
    alignItems: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },

  roundButtonContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    width: 200,
    margin: 10,
  },

  signupContainer: {
    marginHorizontal: 25,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  forgetContainer: {
    alignSelf: "flex-end",
  },

  forgetText: {
    color: GlobalStyles.colors.buttonGreen,
    textDecorationLine: "underline",
  },
});
