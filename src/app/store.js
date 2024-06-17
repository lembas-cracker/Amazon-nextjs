import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

export const createStore = (preloadedState) => {
  return configureStore({
    reducer: {
      basket: basketReducer,
    },
    preloadedState,
  });

  {
    /* if (!store) {
    store = configureStore({
      reducer: {
        basket: basketReducer,
      },
      preloadedState,
    });
  }
  return store;
  */
  }
};
