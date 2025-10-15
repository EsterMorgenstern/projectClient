import { createSlice } from '@reduxjs/toolkit';
import { fetchHealthFunds } from './fetchHealthFunds';
import { addHealthFund } from './addHealthFund';
import { updateHealthFund } from './updateHealthFund';
import { deleteHealthFund } from './deleteHealthFund';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// CRUD thunks are now imported from separate files

const healthFundSlice = createSlice({
  name: 'healthFund',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHealthFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addHealthFund.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateHealthFund.fulfilled, (state, action) => {
        const idx = state.items.findIndex(h => h.healthFundId === action.payload.healthFundId);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteHealthFund.fulfilled, (state, action) => {
        state.items = state.items.filter(h => h.healthFundId !== action.payload);
      });
  },
});

export default healthFundSlice.reducer;
