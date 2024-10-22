import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomBackButton from "../Components/CustomBackButton";
import { PRODUCTS } from "../data/dummy-data";
import Icon from "../Components/Icon";
import { useLayoutEffect } from "react";
import RoundButton from "../Components/RoundButton";
import InboxScreen from "./InboxScreen";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { login } from "../util/auth";
import { deletePost } from "../store/redux/addpost";

const ProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.setUser.user);

  const [posts, setPosts] = useState(null);

  const productId = route.params.productId;

  const deletePostHandler = async (productId) => {
    try {
      const postRef = doc(firestoreDB, "posts", productId);

      await deleteDoc(postRef);

      dispatch(deletePost(productId));

      console.log("Deleted successfully");
      navigation.navigate("Profile", { screen: "ProfileScreen" });
    } catch (error) {
      console.error("Error deleteing post", error);
    }
  };

  useEffect(() => {
    const postsQuery = query(
      collection(firestoreDB, "posts"),
      where("id", "==", productId)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const fetchedPosts = querySnapshot.docs[0].data();
        setPosts(fetchedPosts);
      } else {
        setPosts(null);
      }
    });

    return unsubscribe;
  }, [user?.id, productId]);

  function editHandler() {
    navigation.navigate("EditProductDetail", { productId: productId });
  }

  const handleExchanged = async () => {
    const exchangeRef = doc(firestoreDB, "posts", productId);

    await updateDoc(exchangeRef, { isSold: true });
    navigation.navigate("Profile", { screen: "ProfileScreen" });
  };

  const handleChat = async () => {
    let id = productId;

    const chatData = {
      _id: id,
      user: user,
      post: posts,
    };

    const chatRef = doc(firestoreDB, "users", user.username, "chats", id);
    const chatSnapshot = await getDoc(chatRef);

    if (!chatSnapshot.exists()) {
      await setDoc(
        doc(firestoreDB, "users", user.username, "chats", id),
        chatData
      )
        .then(() => {
          return setDoc(
            doc(firestoreDB, "users", posts.user.username, "chats", id),
            chatData
          );
        })
        .then(() => {
          navigation.navigate("Inbox", { screen: "InboxScreen" });
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } else {
      console.log("Already added");
      navigation.navigate("Inbox", { screen: "InboxScreen" });
    }
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: posts?.itemImage,
            }}
          />
          <View style={styles.backButton}>
            <CustomBackButton onPress={() => navigation.goBack()} />
            {user.username === posts?.user?.username ? (
              <>
                <Icon icon="create-outline" onPress={editHandler} size={28} />
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.productDetailContainer}>
          <Text style={styles.productTitle}>{posts?.name}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.subtitle}>Description: </Text>
            <TextInput>{posts?.description}</TextInput>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Condition</Text>
            <Text>{posts?.condition}</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Category</Text>
            <Text>{posts?.category}</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Meetup Location</Text>
            <Text>{posts?.location}</Text>
          </View>

          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() =>
              navigation.navigate("UserProfileScreen", { user: posts?.user })
            }
          >
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: posts?.user.profilePic,
                }}
              />
            </View>

            <View>
              <Text style={styles.subtitle}>{posts?.user.username}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomBar}>
          {posts?.user.username === user?.username ? (
            <>
              <RoundButton
                title="Exchanged"
                onPress={handleExchanged}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
              />
              <Icon
                icon="trash-outline"
                size={30}
                onPress={() => deletePostHandler(productId)}
              />
            </>
          ) : (
            <>
              {/* <Icon icon="heart-outline" size={30} /> */}
              <RoundButton
                onPress={handleChat}
                title="Chat to exchange"
                containerStyle={styles.button}
                textStyle={styles.buttonText}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },

  imageContainer: {
    width: "100%",
    height: 400,
  },

  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  backButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingHorizontal: 15,
  },

  productDetailContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 15,
  },

  productTitle: {
    fontSize: 23,
    fontWeight: "bold",
  },

  descriptionContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    justifyContent: "space-between",
  },

  subtitle: {
    fontWeight: "bold",
  },

  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    paddingTop: 20,
  },

  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 10,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bottomContainer: {
    backgroundColor: "white",
    width: "100%",
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },

  bottomBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#77976B",
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});
