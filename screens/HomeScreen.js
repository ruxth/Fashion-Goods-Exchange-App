import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { PRODUCTS } from "../data/dummy-data";
import { Ionicons } from "@expo/vector-icons";
import Title from "../Components/Title";
import ProductCard from "../Components/ProductCard";
import favourite from "../store/redux/favourite";
import { GlobalStyles } from "../constants/styles";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [posts, setPosts] = useState(null);

  const user = useSelector((state) => state.setUser.user);

  useEffect(() => {
    const postsQuery = query(
      collection(firestoreDB, "posts"),
      where("isSold", "==", false)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => doc.data());
      setPosts(fetchedPosts);
    });

    return unsubscribe;
  }, []);

  const searchHandle = (text) => {
    setSearchText(text);
    const filteredItems = posts.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  const favouriteHandler = () => {
    navigation.navigate("Favourite");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={searchHandle}
        />
        <Pressable onPress={favouriteHandler}>
          <View>
            <Ionicons name="heart-outline" size={35} />
          </View>
        </Pressable>
      </View>
      <View style={styles.innerContainer}>
        <Image
          style={styles.image}
          source={require("../util/images/Poster.webp")}
        />
        <View style={styles.titleContainer}>
          <Title title="Discover" />
        </View>

        {searchText.length === 0 ? (
          // Initial view: Show items with all items
          <ProductCard items={posts} />
        ) : // If search results found, show items with filtered items
        filteredData.length !== 0 ? (
          <ProductCard items={filteredData} />
        ) : (
          // If no search results found, show "No items found" message
          <Text>No items found</Text>
        )}
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    paddingTop: StatusBar.currentHeight || 65,
  },

  searchInput: {
    height: 40,
    width: 310,
    borderColor: "black",
    borderWidth: 1,
    padding: 8,
  },

  innerContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },

  image: {
    width: "100%",
    height: 150,
  },

  titleContainer: {
    marginTop: 10,
  },
});
