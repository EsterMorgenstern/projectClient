import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStudentHealthFunds,
  addStudentHealthFund,
  updateStudentHealthFund,
  deleteStudentHealthFund
} from './studentHealthFundApi';
import { fetchUnreportedDates } from './fetchUnreportedDates';
import { fetchReportedDates } from './fetchReportedDates';
import { reportUnreportedDate } from './reportUnreportedDate';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  unreportedDates: [],
  unreportedDatesLoading: false,
  unreportedDatesError: null,
  reportedDates: [],
  reportedDatesLoading: false,
  reportedDatesError: null,
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
      })
      .addCase(fetchUnreportedDates.pending, (state) => {
        state.unreportedDatesLoading = true;
        state.unreportedDatesError = null;
      })
      .addCase(fetchUnreportedDates.fulfilled, (state, action) => {
        state.unreportedDatesLoading = false;
        state.unreportedDates = action.payload;
      })
      .addCase(fetchUnreportedDates.rejected, (state, action) => {
        state.unreportedDatesLoading = false;
        state.unreportedDatesError = action.error.message;
      })
      .addCase(fetchReportedDates.pending, (state) => {
        state.reportedDatesLoading = true;
        state.reportedDatesError = null;
      })
      .addCase(fetchReportedDates.fulfilled, (state, action) => {
        state.reportedDatesLoading = false;
        state.reportedDates = action.payload;
      })
      .addCase(fetchReportedDates.rejected, (state, action) => {
        state.reportedDatesLoading = false;
        state.reportedDatesError = action.error.message;
      })
      .addCase(reportUnreportedDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportUnreportedDate.fulfilled, (state, action) => {
        state.loading = false;
        // עדכן את הרשימות - הסר תאריך מלא דווחו והוסף לדווחו
        const { date } = action.payload;
        state.unreportedDates = state.unreportedDates.filter(d => d !== date);
        if (!state.reportedDates.includes(date)) {
          state.reportedDates.push(date);
        }
      })
      .addCase(reportUnreportedDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default studentHealthFundSlice.reducer;
