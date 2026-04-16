import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStudentHealthFunds,
  fetchStudentHealthFundById,
  addStudentHealthFund,
  updateStudentHealthFund,
  deleteStudentHealthFund,
  fetchUnreportedDates,
  fetchReportedDates,
  reportUnreportedDate,
  uploadStudentHealthFundFile,
  validateAndFixUnreportedTreatments,
} from './studentHealthFundApi';

const normalizeDateKey = (value) => {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? String(value) : parsedDate.toISOString();
};

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  saving: false,
  uploadLoading: false,
  uploadResult: null,
  syncLoading: false,
  syncResult: null,
  error: null,
  unreportedDates: [],
  unreportedDatesLoading: false,
  unreportedDatesError: null,
  reportedDates: [],
  reportedDatesLoading: false,
  reportedDatesError: null,
};

const studentHealthFundSlice = createSlice({
  name: 'studentHealthFund',
  initialState,
  reducers: {
    clearStudentHealthFundState(state) {
      state.currentItem = null;
      state.error = null;
      state.uploadResult = null;
      state.syncResult = null;
      state.unreportedDates = [];
      state.reportedDates = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentHealthFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentHealthFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentHealthFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchStudentHealthFundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentHealthFundById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload || null;
      })
      .addCase(fetchStudentHealthFundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addStudentHealthFund.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addStudentHealthFund.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(addStudentHealthFund.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateStudentHealthFund.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateStudentHealthFund.fulfilled, (state, action) => {
        state.saving = false;
        const updatedItem = action.payload;
        const updatedId = updatedItem?.id ?? updatedItem?.Id;
        const idx = state.items.findIndex(s => (s?.id ?? s?.Id) === updatedId);
        if (idx !== -1) state.items[idx] = updatedItem;
        if ((state.currentItem?.id ?? state.currentItem?.Id) === updatedId) {
          state.currentItem = updatedItem;
        }
      })
      .addCase(updateStudentHealthFund.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteStudentHealthFund.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteStudentHealthFund.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter(s => (s?.id ?? s?.Id) !== action.payload);
      })
      .addCase(deleteStudentHealthFund.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUnreportedDates.pending, (state) => {
        state.unreportedDatesLoading = true;
        state.unreportedDatesError = null;
      })
      .addCase(fetchUnreportedDates.fulfilled, (state, action) => {
        state.unreportedDatesLoading = false;
        state.unreportedDates = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUnreportedDates.rejected, (state, action) => {
        state.unreportedDatesLoading = false;
        state.unreportedDatesError = action.payload || action.error.message;
      })
      .addCase(fetchReportedDates.pending, (state) => {
        state.reportedDatesLoading = true;
        state.reportedDatesError = null;
      })
      .addCase(fetchReportedDates.fulfilled, (state, action) => {
        state.reportedDatesLoading = false;
        state.reportedDates = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReportedDates.rejected, (state, action) => {
        state.reportedDatesLoading = false;
        state.reportedDatesError = action.payload || action.error.message;
      })
      .addCase(reportUnreportedDate.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(reportUnreportedDate.fulfilled, (state, action) => {
        state.saving = false;
        const reportedDateKey = normalizeDateKey(action.payload.date);
        state.unreportedDates = state.unreportedDates.filter(date => normalizeDateKey(date) !== reportedDateKey);
        const exists = state.reportedDates.some(date => normalizeDateKey(date) === reportedDateKey);
        if (!exists) {
          state.reportedDates.push(action.payload.date);
        }
      })
      .addCase(reportUnreportedDate.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(uploadStudentHealthFundFile.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadStudentHealthFundFile.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadResult = action.payload;
      })
      .addCase(uploadStudentHealthFundFile.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(validateAndFixUnreportedTreatments.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(validateAndFixUnreportedTreatments.fulfilled, (state, action) => {
        state.syncLoading = false;
        state.syncResult = action.payload;
      })
      .addCase(validateAndFixUnreportedTreatments.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearStudentHealthFundState } = studentHealthFundSlice.actions;

export const selectStudentHealthFunds = (state) => state.studentHealthFunds.items;
export const selectStudentHealthFundsLoading = (state) => state.studentHealthFunds.loading;
export const selectStudentHealthFundSaving = (state) => state.studentHealthFunds.saving;
export const selectStudentHealthFundError = (state) => state.studentHealthFunds.error;
export const selectUnreportedDates = (state) => state.studentHealthFunds.unreportedDates;
export const selectReportedDates = (state) => state.studentHealthFunds.reportedDates;

export default studentHealthFundSlice.reducer;
