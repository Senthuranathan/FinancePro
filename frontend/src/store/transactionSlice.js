import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../config';
import { logout } from './authSlice';

export const fetchTransactions = createAsyncThunk('transactions/fetch', async ({ page, search, type }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token;

  let url = `${API_BASE_URL}/transactions?page=${page}&limit=10`;
  if (search) url += `&search=${search}`;
  if (type) url += `&type=${type}`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) {
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue('Session expired');
  }
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export default transactionSlice.reducer;
