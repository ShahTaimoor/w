import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

export const AddProduct = createAsyncThunk(
    'products/AddProduct',
    async (inputValues, thunkAPI) => {
        try {
            const res = await productService.createProduct(inputValues);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async ({ category, searchTerm }, thunkAPI) => {
        try {
            const res = await productService.allProduct(category, searchTerm);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const getSingleProduct = createAsyncThunk(
    "products/getSingleProduct",
    async (id, thunkAPI) => {
        try {
            const res = await productService.getSingleProd(id);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateSingleProduct = createAsyncThunk(
    "products/updateSingleProduct",
    async ({ id, inputValues }, thunkAPI) => {
        try {
            const res = await productService.updateProd({ id, inputValues });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, thunkAPI) => {
        try {
            const res = await productService.deleteProduct(id);
            return { id, message: res.message };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    products: [],
    singleProducts: null,
    status: 'idle',
    error: null
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(AddProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products.push(action.payload.product);
            })
            .addCase(AddProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateSingleProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateSingleProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedProduct = action.payload.product;

                // Update the product in the array instead of replacing the whole list
                state.products = state.products.map((prod) =>
                    prod._id === updatedProduct._id ? updatedProduct : prod
                );
            })
            .addCase(updateSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getSingleProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.singleProducts = action.payload.product;
            })
            .addCase(getSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = state.products.filter(prod => prod._id !== action.payload.id);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
});

export default productsSlice.reducer;
