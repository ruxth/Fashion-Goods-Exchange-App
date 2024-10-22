import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { PRODUCTS } from "../data/dummy-data";
import ProductCard from "../Components/ProductCard";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";

const FavouriteScreen = () => {
  const [favourites, setFavourites] = useState(null);
  const [hasFavourites, setHasFavourites] = useState(false);

  const favouriteProductId = useSelector(
    (state) => state.favouriteProducts.ids
  );
  const user = useSelector((state) => state.setUser.user);

  const posts = useSelector((state) => state.setPost.products);

  useEffect(() => {
    const favouritesQuery = query(
      collection(firestoreDB, "users", user.username, "favourites")
    );

    const unsubscribe = onSnapshot(favouritesQuery, (querySnapshot) => {
      const fetchedFavourites = querySnapshot.docs.map((doc) => doc.data());
      console.log("favourites", fetchedFavourites);
      setFavourites(fetchedFavourites);
      setHasFavourites(fetchedFavourites.length > 0);
    });

    return unsubscribe;
  }, []);

  return (
    <View>
      {hasFavourites ? (
        <>
          <ProductCard items={favourites} />
        </>
      ) : (
        <>
          <View>
            <Text style={styles.nopostText}>
              You have no favourite products yet.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  nopostText: {
    textAlign: "center",
    paddingTop: 50,
  },
});
