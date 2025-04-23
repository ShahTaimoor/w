// redux/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      state.products = state.products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      );
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((product) => product._id !== productId);
    },
  },
});

export const { setProducts, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
