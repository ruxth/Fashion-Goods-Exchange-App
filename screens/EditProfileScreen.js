import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomBackButton from "../Components/CustomBackButton";
import RoundButton from "../Components/RoundButton";
import { GlobalStyles } from "../constants/styles";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { setUserNull } from "../store/redux/userAuth";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";

const EditProfileScreen = () => {
  const user = useSelector((state) => state.setUser.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.providerData.email);

  const logoutHandler = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(setUserNull());
      navigation.replace("StartingScreen");
    });
  };

  const editHandler = async () => {
    const editProfile = {
      username: username,
    };

    const docRef = doc(firestoreDB, "users", user.id);
    await updateDoc(docRef, editProfile);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: user?.profilePic,
          }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Username:</Text>
        <TextInput
          style={styles.text}
          value={username}
          onChangeText={setUsername}
          editable={true}
        ></TextInput>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Email:</Text>
        <TextInput
          style={styles.text}
          value={email}
          onChangeText={setEmail}
        ></TextInput>
      </View>
      <RoundButton
        title="Edit"
        containerStyle={styles.logoutButton}
        onPress={editHandler}
      />

      <RoundButton
        title="Logout"
        containerStyle={styles.logoutButton}
        onPress={logoutHandler}
      />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    padding: 5,
  },

  logoutButton: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    width: "100%",
    marginTop: 10,
  },
});
