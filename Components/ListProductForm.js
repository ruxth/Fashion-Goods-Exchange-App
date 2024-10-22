import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { useDispatch } from "react-redux";
import { addPost } from "../store/redux/addpost";
import { useNavigation } from "@react-navigation/native";
import Input from "./Input";
import RoundButton from "./RoundButton";
import { firebaseAuth, firestoreDB, storage } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { GlobalStyles } from "../constants/styles";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Dropdown from "./ui/Dropdown";
import { CATEGORY, CONDITION, LOCATION } from "../data/dummy-data";

function ListProductForm() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.setUser.user);
  const [pickedImage, setPickedImage] = useState();
  const postId = `${Date.now()}`;

  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    category: null,
    condition: null,
    location: null,
  });

  function handleInputChange(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: enteredValue,
      };
    });
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

  const handlePostSubmit = async () => {
    try {
      if (
        !inputs.name ||
        !inputs.description ||
        !inputs.category ||
        !inputs.condition ||
        !inputs.location
      ) {
        Alert.alert("Error", "Please fill in all the fields");
        return;
      }

      const timeStamp = Date.now();

      const storageRef = ref(storage, `productImages/${timeStamp}.jpg`);

      await uploadBytes(
        storageRef,
        await fetch(pickedImage).then((res) => res.blob())
      );
      const downloadURL = await getDownloadURL(storageRef);

      const selectedCondition = CONDITION.find(
        (item) => item.key === inputs.condition
      );
      const selectedCategory = CATEGORY.find(
        (item) => item.key === inputs.category
      );
      const selectedLocation = LOCATION.find(
        (item) => item.key === inputs.location
      );

      const postData = {
        id: postId,
        name: inputs.name,
        description: inputs.description,
        condition: selectedCondition.value,
        category: selectedCategory.value,
        location: selectedLocation.value,
        itemImage: downloadURL,
        user: user,
        isSold: false,
      };

      await setDoc(doc(firestoreDB, "posts", postId), postData);
      dispatch(addPost(postData));

      setInputs({
        name: "",
        description: "",
        condition: "Select Condition",
        category: "Select Cetgory",
        location: "Select Location",
      });
      setPickedImage("");
      navigation.navigate("Profile", { screen: "ProfileScreen" });
    } catch (err) {
      console.error("Error Posting item: ", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>

      <RoundButton
        title="Upload Image"
        onPress={uploadImageHandler}
        containerStyle={styles.roundButtonContainer}
      />

      <Input
        label="Item Name"
        textInputConfig={{
          value: inputs.name,
          onChangeText: handleInputChange.bind(this, "name"),
          placeholder: "eg. Zara Skirt",
        }}
      />

      <Input
        label="Item description"
        textInputConfig={{
          multiline: true,
          value: inputs.description,
          onChangeText: handleInputChange.bind(this, "description"),
          placeholder: "eg. Sizing, Condition, etc...",
        }}
      />

      <Dropdown
        label="Item Condition"
        data={CONDITION}
        setSelected={handleInputChange.bind(this, "condition")}
        placeholder="Select Condition"
      />

      <Dropdown
        label="Category"
        data={CATEGORY}
        setSelected={handleInputChange.bind(this, "category")}
        placeholder="Select Category"
      />

      <Dropdown
        label="Meetup Location"
        data={LOCATION}
        setSelected={handleInputChange.bind(this, "location")}
        placeholder="Select Location"
      />

      {/* <Input
        label="Meetup Location"
        textInputConfig={{
          value: inputs.location,
          onChangeText: handleInputChange.bind(this, "location"),
          placeholder: "eg. Lakeside, Orchard, Woodlands, etc...",
        }}
      /> */}

      <RoundButton
        title="Post"
        onPress={handlePostSubmit}
        containerStyle={styles.exchangeButtonContainer}
        textStyle={styles.exchangeButtonText}
      />
    </ScrollView>
  );
}

export default ListProductForm;

const styles = StyleSheet.create({
  exchangeButtonContainer: {
    backgroundColor: "#77976B",
  },

  imagePreview: {
    width: 150,
    height: 150,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  roundButtonContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    width: 200,
    margin: 10,
  },

  exchangeButtonText: {
    color: "#fff",
  },
});
