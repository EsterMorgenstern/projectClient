import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCommitmentsByStudentHealthFund,
  fetchHealthFundCommitmentById,
  addHealthFundCommitment,
  updateHealthFundCommitment,
  deleteHealthFundCommitment,
} from './healthFundCommitmentApi';

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  saving: false,
  error: null,
};

const healthFundCommitmentSlice = createSlice({
  name: 'healthFundCommitment',
  initialState,
  reducers: {
    clearHealthFundCommitments(state) {
      state.items = [];
      state.currentItem = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommitmentsByStudentHealthFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitmentsByStudentHealthFund.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommitmentsByStudentHealthFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchHealthFundCommitmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthFundCommitmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload || null;
      })
      .addCase(fetchHealthFundCommitmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addHealthFundCommitment.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addHealthFundCommitment.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(addHealthFundCommitment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateHealthFundCommitment.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateHealthFundCommitment.fulfilled, (state, action) => {
        state.saving = false;
        const updatedItem = action.payload;
        const updatedId = updatedItem?.id ?? updatedItem?.Id;
        const index = state.items.findIndex(item => (item?.id ?? item?.Id) === updatedId);

        if (index !== -1) {
          state.items[index] = updatedItem;
        }

        if ((state.currentItem?.id ?? state.currentItem?.Id) === updatedId) {
          state.currentItem = updatedItem;
        }
      })
      .addCase(updateHealthFundCommitment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteHealthFundCommitment.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteHealthFundCommitment.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter(item => (item?.id ?? item?.Id) !== action.payload);
        if ((state.currentItem?.id ?? state.currentItem?.Id) === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteHealthFundCommitment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearHealthFundCommitments } = healthFundCommitmentSlice.actions;

export const selectHealthFundCommitments = (state) => state.healthFundCommitments.items;
export const selectHealthFundCommitmentsLoading = (state) => state.healthFundCommitments.loading;
export const selectHealthFundCommitmentsSaving = (state) => state.healthFundCommitments.saving;
export const selectHealthFundCommitmentsError = (state) => state.healthFundCommitments.error;
export const selectCurrentHealthFundCommitment = (state) => state.healthFundCommitments.currentItem;

export default healthFundCommitmentSlice.reducer;
