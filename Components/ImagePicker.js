import { View, Button, Image, Text, StyleSheet } from "react-native";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";

import { useState } from "react";
import RoundButton from "./RoundButton";
import { GlobalStyles } from "../constants/styles";
import { firebase } from "@react-native-firebase/auth";

function ImagePickerComponent({ imageStyle, container }) {
  const [pickedImage, setPickedImage] = useState();

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
    imagePreview = (
      <Image style={[styles.image, imageStyle]} source={{ uri: pickedImage }} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>

      <RoundButton
        title="Upload Image"
        onPress={uploadImageHandler}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

export default ImagePickerComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  buttonContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    width: 200,
    margin: 10,
  },
});
