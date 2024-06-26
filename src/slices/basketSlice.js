import { createSlice, createAsyncThunk, createListenerMiddleware } from "@reduxjs/toolkit";
import axios from "axios";

export const saveBasket = createAsyncThunk("basket/saveBasket", async ({ email, items }) => {
  if (email) {
    await axios.post("api/basket/save", { email, items });
  } else {
    localStorage.setItem("items", JSON.stringify(items));
  }

  return items;
});

const initialState = {
  items: [],
  status: "idle",
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const index = state.items?.findIndex((basketItem) => basketItem.id === action.payload.id);
      if (index >= 0) {
        state.items[index].quantity += 1;
      } else {
        state.items?.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex((basketItem) => basketItem.id === action.payload.id); //action.payload.id is the {id} we passed into dispatch()
      let newBasket = [...state.items];

      if (index >= 0) {
        if (newBasket[index].quantity > 1) {
          newBasket[index].quantity -= 1;
        } else {
          newBasket.splice(index, 1);
        }
      } else {
        console.warn(`Cannot remove product (id: ${action.payload.id}) as it's not in the basket`);
      }

      //assigning modified basket copy to the global state to prevent mutability
      state.items = newBasket;
    },
    setBasket: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveBasket.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.items = action.payload;
    }),
      builder.addCase(saveBasket.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const { addToBasket, removeFromBasket, setBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;

export const selectTotal = (state) =>
  (state.basket.items || []).reduce((acc, item) => acc + item.price * item.quantity, 0);

export const selectTotalQuantity = (state) =>
  (state.basket.items || []).map((e) => e.quantity).reduce((acc, e) => acc + e, 0);

export default basketSlice.reducer;
