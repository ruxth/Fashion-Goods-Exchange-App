import { configureStore } from "@reduxjs/toolkit";
import favouriteReducers from "./favourite";
import postReducer from "./addpost";
import userAuthReducer from "./userAuth";

export const store = configureStore({
  reducer: {
    favouriteProducts: favouriteReducers,
    setPost: postReducer,
    setUser: userAuthReducer,
  },
});
