import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import { CATEGORIES } from "../data/dummy-data";

const CategoryScreen = () => {
  const navigation = useNavigation();

  function renderCategoryItem(itemData) {
    const categoryHandler = () => {
      navigation.navigate("CategoryDetail", {
        categoryName: itemData.item.title,
      });
    };
    return (
      <View style={styles.categoryContainer}>
        <Pressable android_ripple={{ color: "#ccc" }} onPress={categoryHandler}>
          <Image
            style={styles.productImage}
            source={{
              uri: itemData.item.imageUrl,
            }}
          />
          <Text style={styles.overlayText}>{itemData.item.title}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 65,
    flex: 1,
    alignItems: "center",
  },

  categoryContainer: {
    padding: 10,
  },

  productImage: {
    height: 180,
    width: 180,
  },

  overlayText: {
    position: "absolute",
    color: "white",
    alignSelf: "center",
    top: "45%",
    fontSize: 18,
    fontWeight: "bold",
  },
});
