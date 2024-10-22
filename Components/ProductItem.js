import { View, Pressable, Text, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "./Icon";
import { GlobalStyles } from "../constants/styles";
import { deletePost } from "../store/redux/addpost";
import { useDispatch } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

function ProductItem({
  id,
  title,
  imageUrl,
  condition,
  onPress,
  icon,
  isSold,
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function productDetailHandler() {
    if (isSold) {
    } else {
      navigation.navigate("ProductDetail", { productId: id });
    }
  }

  const deletePostHandler = async (id) => {
    try {
      const postRef = doc(firestoreDB, "posts", id);

      await deleteDoc(postRef);

      dispatch(deletePost(id));

      Alert.alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleteing post", error);
    }
  };

  return (
    <View style={styles.productContainer}>
      <Pressable onPress={productDetailHandler}>
        {isSold ? (
          <>
            <Image
              style={styles.productImage}
              source={{
                uri: imageUrl,
              }}
            />
            <View style={styles.exchangedContainer}>
              <Text style={styles.exchangedText}>Exchanged</Text>
            </View>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.conditionText}>{condition}</Text>
                <Text style={styles.productTitleText}>{title}</Text>
              </View>
              <Icon
                icon="trash-outline"
                onPress={() => deletePostHandler(id)}
              />
            </View>
          </>
        ) : (
          <>
            <Image
              style={styles.productImage}
              source={{
                uri: imageUrl,
              }}
            />
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.conditionText}>{condition}</Text>
                <Text style={styles.productTitleText}>{title}</Text>
              </View>
              <Icon icon={icon} onPress={onPress} />
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
}

export default ProductItem;

const styles = StyleSheet.create({
  productImage: {
    height: 180,
    width: 180,
  },

  productContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
    paddingTop: 5,
  },

  productTitleText: {
    fontSize: 12,
  },

  conditionText: {
    fontSize: 10,
  },

  exchangedContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    padding: 5,
  },

  exchangedText: {
    fontSize: 12,
    alignSelf: "center",
  },
});
