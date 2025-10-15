import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStudentHealthFunds,
  addStudentHealthFund,
  updateStudentHealthFund,
  deleteStudentHealthFund
} from './studentHealthFundApi';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// CRUD thunks are now imported from studentHealthFundApi.js

const studentHealthFundSlice = createSlice({
  name: 'studentHealthFund',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentHealthFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Fetching student health funds...'); // Debug log
      })
      .addCase(fetchStudentHealthFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Fetched student health funds:', action.payload); // Debug log
      })
      .addCase(fetchStudentHealthFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('Error fetching student health funds:', action.error.message); // Debug log
      })
      .addCase(addStudentHealthFund.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateStudentHealthFund.fulfilled, (state, action) => {
        const idx = state.items.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteStudentHealthFund.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      });
  },
});

export default studentHealthFundSlice.reducer;
