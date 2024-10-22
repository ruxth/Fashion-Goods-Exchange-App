import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    products: [],
  },
  reducers: {
    addPost: (state, action) => {
      state.products.push(action.payload);
      console.log("Added product to redux:", state.products);
    },
    editPost: (state, action) => {
      const { id, updatedProduct } = action.payload;
      const index = state.products.findIndex((product) => product.id === id);

      if (index !== -1) {
        state.products[index] = updatedProduct;
        console.log("Edited product in redux:", state.products);
      }
    },
    deletePost: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      console.log("Deleted product to redux:", state.products);
    },
    removeAllPosts: (state) => {
      state.products = [];
    },
  },
});

export const { addPost, deletePost, editPost } = postSlice.actions;

export default postSlice.reducer;
