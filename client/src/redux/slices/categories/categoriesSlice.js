// redux/slices/categories/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoriesService";

export const AddCategory = createAsyncThunk(
    'categories/addCategory',
    async (inputValues, thunkAPI) => {
        try {
            const res = await categoryService.createCat(inputValues);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async (slug, thunkAPI) => {
        try {
            const res = await categoryService.updateCat(slug);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (slug, thunkAPI) => {
        try {
            const res = await categoryService.deleteCat(slug);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const AllCategory = createAsyncThunk(
    'categories/allCategory',
    async (_, thunkAPI) => {
        try {
            const res = await categoryService.getAllCat();
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const SingleCategory = createAsyncThunk(
    'categories/singleCategory',
    async (slug, thunkAPI) => {
        try {
            const res = await categoryService.getSingleCat(slug);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    categories: [],
    status: 'idle',
    error: null
};

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(AddCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories.push(action.payload.data);
            })
            .addCase(AddCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(AllCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(AllCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload.data;
            })
            .addCase(AllCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(SingleCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(SingleCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload.data;
            })
            .addCase(SingleCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload.data;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload.data;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
});

export default categoriesSlice.reducer;
