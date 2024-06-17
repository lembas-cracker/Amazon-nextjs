import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

let store;

const createStore = (preloadedState) => {
  if (typeof window === "undefined") {
    return configureStore({
      reducer: {
        basket: basketReducer,
      },
      preloadedState,
    });
  }

  if (!store) {
    store = configureStore({
      reducer: {
        basket: basketReducer,
      },
      preloadedState,
    });
  }
  return store;
};

export default createStore;
