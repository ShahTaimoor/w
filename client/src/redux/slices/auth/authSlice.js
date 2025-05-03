import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

// Login Async Action
export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            const res = await authService.loginUser(user);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const getUserDataFromLocalStorage = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null

const initialState = {
    user: getUserDataFromLocalStorage,
    status: 'idle',
    error: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'success';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; 
            });
    }
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;
