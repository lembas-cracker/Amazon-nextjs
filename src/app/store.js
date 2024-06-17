import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

export const createStore = (preloadedState) => {
  return configureStore({
    reducer: {
      basket: basketReducer,
    },
    preloadedState,
  });
};
