import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
import { setUserNull } from "../store/redux/userAuth";

const ProfileScreen = () => {
  const user = useSelector((state) => state.setUser.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState(null);
  const [hasPosts, setHasPosts] = useState(false);
  const [exchangedPosts, setExchangedPosts] = useState(null);
  const [hasExchanged, setHasExchanged] = useState(false);
  const [exchangedProgress, setExchangedProgress] = useState("0");

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
      setExchangedProgress(exchangedPosts.length);
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
          <View>
            <Text>{user?.username}</Text>
            <Text>{user?.providerData?.email}</Text>
          </View>

          <Icon icon="log-out-outline" onPress={logoutHandler} />
        </View>
      </View>
      <View style={styles.itemTitleContainer}>
        <Text style={styles.itemTitleText}>Progress:</Text>
        <View style={styles.progressContainer}>
          <Image
            source={require("../util/images/exchangeProgress.png")}
            style={styles.iconImage}
          />
          <Text>{exchangedProgress} items exchanged</Text>
        </View>
      </View>

      {hasPosts && (
        <>
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemTitleText}>Listed Items:</Text>
          </View>

          <ProductCard items={posts} />
        </>
      )}

      {!hasPosts && (
        <>
          <Text style={styles.nopostText}>You have not posted anything.</Text>
        </>
      )}

      {/* {hasPosts ? (
        <>
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemTitleText}>Listed Items:</Text>
          </View>

          <ProductCard items={posts} />
        </>
      ) : (
        <>
          <Text style={styles.nopostText}>You have not post anything.</Text>
        </>
      )} */}
    </View>
  );
};

export default ProfileScreen;

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
    paddingTop: 55,
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

  progressContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconImage: {
    width: 25,
    height: 25,
  },

  itemTitleContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  itemTitleText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  nopostText: {
    textAlign: "center",
    paddingTop: 50,
  },
});
