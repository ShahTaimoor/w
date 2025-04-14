import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        role: localStorage.getItem('role') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('token')
    },
    reducers: {
        setUserLogin: (state, action) => {
            // Validate payload structure
            if (!action.payload || !action.payload.token) {
                console.error('Invalid login payload');
                return;
            }

            state.role = action.payload.user.role || '';
            state.user = action.payload.user || {};
            state.isAuthenticated = true;
            
            // Correct localStorage serialization
            localStorage.setItem('role', action.payload.user.role || '');
            localStorage.setItem('user', JSON.stringify(action.payload.user || {}));
            localStorage.setItem('token', action.payload.token);
        },
        setUserLogout: (state) => {
            state.role = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    }
})

export const { setUserLogin, setUserLogout } = authSlice.actions
export default authSlice.reducer