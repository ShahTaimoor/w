import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingIndex = state.cartItems.findIndex(item => item._id === newItem._id);

      if (existingIndex === -1) {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity,
          totalItemPrice: newItem.quantity * newItem.price
        });
      } else {
        const existingItem = state.cartItems[existingIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalItemPrice += newItem.quantity * newItem.price;
      }

      state.totalQuantity += newItem.quantity;
      state.totalPrice = Number((state.totalPrice + newItem.price * newItem.quantity).toFixed(2));
    },

    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const existingIndex = state.cartItems.findIndex(item => item._id === itemToRemove._id);

      if (existingIndex === -1) return;

      const existingItem = state.cartItems[existingIndex];

      // Adjust quantities and prices
      existingItem.quantity -= itemToRemove.quantity;
      existingItem.totalItemPrice -= itemToRemove.quantity * itemToRemove.price;
      state.totalQuantity -= itemToRemove.quantity;
      state.totalPrice = Number((state.totalPrice - itemToRemove.quantity * itemToRemove.price).toFixed(2));

      // Remove item if quantity is 0 or less
      if (existingItem.quantity <= 0) {
        state.cartItems.splice(existingIndex, 1);
      }
    },

    emptyCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  }
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
