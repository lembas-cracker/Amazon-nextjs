import { useMemo } from "react";
import { createStore } from "./store";

let store;

export function initializeStore(preloadedState) {
  let _store = store ?? createStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state with the current state in the store,
  // and create a new store
  if (preloadedState && store) {
    _store = createStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  // For SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
