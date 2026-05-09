import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../config';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const validateSession = createAsyncThunk('auth/validate', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token;
  if (!token) return thunkAPI.rejectWithValue('No token');

  try {
    const response = await fetch(`${API_BASE_URL}/budget`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) {
      thunkAPI.dispatch(logout());
      return thunkAPI.rejectWithValue('Session expired');
    }
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
