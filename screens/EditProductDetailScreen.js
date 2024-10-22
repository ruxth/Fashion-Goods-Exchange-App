import {
  View,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { useId } from "react";
import { useNavigation } from "@react-navigation/native";
import Input from "../Components/Input";
import RoundButton from "../Components/RoundButton";
import { firebaseAuth, firestoreDB, storage } from "../config/firebase.config";
import {
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
  collection,
  updateDoc,
} from "firebase/firestore";
import { GlobalStyles } from "../constants/styles";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Dropdown from "../Components/ui/Dropdown";
import { CATEGORY, CONDITION, LOCATION } from "../data/dummy-data";
import { editPost } from "../store/redux/addpost";

const EditProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.setUser.user);
  const productId = route.params.productId;

  const [posts, setPosts] = useState(null);
  const [pickedImage, setPickedImage] = useState();
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const postsQuery = query(
      collection(firestoreDB, "posts"),
      where("id", "==", productId)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs[0].data();
      setPosts(fetchedPosts);
      console.log(fetchedPosts);

      setInputs({
        name: fetchedPosts?.name || "",
        description: fetchedPosts?.description || "",
      });

      setCondition(fetchedPosts?.condition);
      setCategory(fetchedPosts?.category);
      setLocation(fetchedPosts?.location);
      setPickedImage(fetchedPosts?.itemImage);
    });

    // Return unsubscribe to stop listening to the updates
    return unsubscribe;
  }, [user?.id]);

  // const [selectedCondition, setselectedCondition] = useState("");
  // const [selectedCategory, setselectedCategory] = useState("");

  function handleDropdownChange(selectedKey, data, setterFunction) {
    const selectedItem = data.find((item) => item.key === selectedKey);
    setterFunction(selectedItem ? selectedItem.value : "");
  }

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

  const handleEditSubmit = async () => {
    try {
      if (!inputs.name || !inputs.description) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      const timeStamp = Date.now();

      const storageRef = ref(storage, `productImages/${timeStamp}.jpg`);

      await uploadBytes(
        storageRef,
        await fetch(pickedImage).then((res) => res.blob())
      );
      const downloadURL = await getDownloadURL(storageRef);

      const editData = {
        name: inputs.name,
        description: inputs.description,
        condition: condition,
        category: category,
        location: location,
        itemImage: downloadURL,
        user: user,
      };

      const docRef = doc(firestoreDB, "posts", productId);
      await updateDoc(docRef, editData);

      dispatch(editPost({ id: productId, updatedProduct: editData }));

      navigation.navigate("ProductDetail", { productId: productId });
    } catch (err) {
      console.error("Error editing document: ", err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
          setSelected={(key) =>
            handleDropdownChange(key, CONDITION, setCondition)
          }
          placeholder={condition}
        />

        <Dropdown
          label="Category"
          data={CATEGORY}
          setSelected={(key) =>
            handleDropdownChange(key, CATEGORY, setCategory)
          }
          placeholder={category}
        />

        <Dropdown
          label="Meetup Location"
          data={LOCATION}
          setSelected={(key) =>
            handleDropdownChange(key, LOCATION, setLocation)
          }
          placeholder={location}
        />
      </ScrollView>
      <RoundButton
        title="Edit"
        onPress={handleEditSubmit}
        containerStyle={styles.exchangeButtonContainer}
        textStyle={styles.exchangeButtonText}
      />
    </View>
  );
};

export default EditProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 25,
    marginHorizontal: 25,
  },
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
