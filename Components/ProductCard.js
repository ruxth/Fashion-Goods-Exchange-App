import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import Icon from "./Icon";
import ProductItem from "./ProductItem";
import { addFavourite, removeFavourite } from "../store/redux/favourite";
import { firebaseAuth, firestoreDB, storage } from "../config/firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function ProductCard({ items, onPress }) {
  const [favourites, setFavourites] = useState([]);

  const user = useSelector((state) => state.setUser.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.username) {
      const fetchUserFavourites = async () => {
        const favouritesQuery = query(
          collection(firestoreDB, "users", user?.username, "favourites")
        );

        const unsubscribe = onSnapshot(favouritesQuery, (querySnapshot) => {
          const fetchedFavourites = querySnapshot.docs.map((doc) => doc.data());
          setFavourites(fetchedFavourites);
        });

        return unsubscribe;
      };

      fetchUserFavourites();
    } else {
      setFavourites([]);
    }
  }, [user?.username]);

  function renderProductItem(itemData) {
    const item = itemData.item;
    const productId = item?.id;

    const productIsFavourite =
      favourites && favourites.find((product) => product.id === productId);

    const favouriteHandle = async () => {
      if (productIsFavourite) {
        const favouriteRef = doc(
          firestoreDB,
          "users",
          user.username,
          "favourites",
          productId
        );
        await deleteDoc(favouriteRef);

        dispatch(removeFavourite({ id: productId }));
      } else {
        await setDoc(
          doc(firestoreDB, "users", user.username, "favourites", productId),
          item
        );

        dispatch(addFavourite({ id: productId }));
      }
    };

    const productItemProps = {
      id: item.id,
      title: item.name,
      imageUrl: item.itemImage,
      condition: item.condition,
      isSold: item.isSold,
      onPress: favouriteHandle,
      icon: productIsFavourite ? "heart" : "heart-outline",
    };

    return <ProductItem {...productItemProps} />;
  }
  return (
    <View style={styles.productContainer}>
      <FlatList
        data={items?.slice().sort((a, b) => (a.isSold ? 1 : -1))}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
      />
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  productContainer: {
    alignItems: "center",
  },
});
