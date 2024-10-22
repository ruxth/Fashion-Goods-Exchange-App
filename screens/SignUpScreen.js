import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { useContext, useState } from "react";

import SignUpForm from "../Components/SignUp/SignUpForm";
import SignUpAuth from "../Components/SignUp/SignUpAuth";
import LoadingOverlay from "../Components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import { AuthContext } from "../store/auth-context";
import { fetchUser, storeUser } from "../util/http";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB, storage } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import ImagePickerComponent from "../Components/ImagePicker";
import SignUpTitle from "../Components/SignUp/SignUpTitle";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password, username, imageURI }) {
    try {
      const timeStamp = Date.now();

      const storageRef = ref(storage, `profileImages/${timeStamp}.jpg`);

      await uploadBytes(
        storageRef,
        await fetch(imageURI).then((res) => res.blob())
      );

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      const userCred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const data = {
        id: userCred?.user.uid,
        username: username,
        providerData: userCred.user.providerData[0],
        profilePic: downloadURL,
      };

      setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(() => {
        setIsAuthenticating(true);
        navigation.navigate("SplashScreen");
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return (
    <View style={styles.container}>
      <SignUpTitle title="Sign Up" style={styles.title} />

      {/* <ImagePickerComponent imageStyle={styles.image} /> */}
      <SignUpAuth onAuthenticate={signupHandler} />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    paddingLeft: 30,
    paddingVertical: 10,
  },

  image: {
    borderRadius: 100,
  },
});
