import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex((basketItem) => basketItem.id === action.payload.id); //action.payload.id is the {id} we passed into dispatch()
      let newBasket = [...state.items];

      if (index >= 0) {
        //if item exists in the basket then remove it
        newBasket.splice(index, 1);
      } else {
        console.warn(`Cannot remove product (id: ${action.payload.id}) as it's not in the basket`);
      }

      //assigning modified basket copy to the global state to prevent mutability
      state.items = newBasket;
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;
export const selectTotal = (state) => state.basket.items.reduce((acc, item) => acc + item.price, 0);

export default basketSlice.reducer;
