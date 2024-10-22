import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";

import RoundButton from "../Components/RoundButton";
import Icon from "../Components/Icon";
import ProductCard from "../Components/ProductCard";
import ProfileCard from "../Components/ui/ProfileCard";
import { PRODUCTS } from "../data/dummy-data";
import { GlobalStyles } from "../constants/styles";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";

const UserProfileScreen = ({ route }) => {
  const user = route.params.user;
  const [posts, setPosts] = useState(null);
  const [hasPosts, setHasPosts] = useState(false);
  const [exchangedPosts, setExchangedPosts] = useState(null);
  const [hasExchanged, setHasExchanged] = useState(false);

  const navigation = useNavigation();

  const logoutHandler = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(setUserNull());
      navigation.replace("StartingScreen");
    });
  };

  useEffect(() => {
    const postsQuery = query(
      collection(firestoreDB, "posts"),
      where("user.id", "==", user.id)
    );

    const exchangedQuery = query(
      collection(firestoreDB, "posts"),
      where("user.id", "==", user.id),
      where("isSold", "==", true)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => doc.data());
      setPosts(fetchedPosts);
      setHasPosts(fetchedPosts.length > 0);
    });

    const exchangedUnsubscribe = onSnapshot(exchangedQuery, (querySnapshot) => {
      const exchangedPosts = querySnapshot.docs.map((doc) => doc.data());
      setExchangedPosts(exchangedPosts);
      setHasExchanged(exchangedPosts.length > 0);
    });

    // Return unsubscribe to stop listening to the updates
    return unsubscribe, exchangedUnsubscribe;
  }, [user?.id]);

  return (
    <View style={styles.outerContainer}>
      {/* <ProfileCard /> */}
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
          <Text>{user?.username}</Text>
          <Text>{user?.email}</Text>
        </View>
      </View>

      {hasPosts ? (
        <>
          {/* {hasExchanged ? (
            <>
              <ProductCard items={exchangedPosts} />
            </>
          ) : (
            <></>
          )} */}
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemTitleText}>Listed Items:</Text>
          </View>

          <ProductCard items={posts} />
        </>
      ) : (
        <>
          <Text>User has not post anything.</Text>
        </>
      )}
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.backgroundGreen,
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    flex: 1,
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleText: {
    fontWeight: "bold",
  },

  itemTitleContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  itemTitleText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
