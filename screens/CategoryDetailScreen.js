import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { CATEGORIES, PRODUCTS } from "../data/dummy-data";
import ProductItem from "../Components/ProductItem";
import ProductCard from "../Components/ProductCard";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const CategoryDetailScreen = ({ route, navigation }) => {
  //using navigation route to access the parameters in CatgoryScreen
  const catName = route.params.categoryName;

  const [posts, setPosts] = useState(null);
  const [hasPosts, setHasPosts] = useState(false);

  useEffect(() => {
    const postsQuery = query(
      collection(firestoreDB, "posts"),
      where("category", "==", catName),
      where("isSold", "==", false)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => doc.data());
      setPosts(fetchedPosts);
      setHasPosts(fetchedPosts.length > 0);
    });

    return unsubscribe;
  }, [catName]);

  return (
    <View style={styles.container}>
      <View style={styles.itemTitleContainer}>
        <Text style={styles.itemTitleText}>{catName}</Text>
      </View>
      {hasPosts ? (
        <>
          <ProductCard items={posts} />
        </>
      ) : (
        <>
          <Text style={styles.nopostText}>
            There is no items to exchange under this category.
          </Text>
        </>
      )}
    </View>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemTitleContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  itemTitleText: {
    fontWeight: "bold",
    fontSize: 22,
  },
  nopostText: {
    textAlign: "center",
    paddingTop: 50,
  },
});
