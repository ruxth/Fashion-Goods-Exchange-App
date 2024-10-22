import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useId } from "react";
import { addPost } from "../store/redux/addpost";
import ListProductForm from "../Components/ListProductForm";

const ExchangeScreen = ({ navigation }) => {
  const posts = useSelector((state) => state.setPost.products);
  console.log(posts);

  return (
    <View style={styles.container}>
      <ListProductForm />
    </View>
  );
};

export default ExchangeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 65,
    marginHorizontal: 25,
  },
});
