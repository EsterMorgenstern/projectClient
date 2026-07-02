import { createSlice } from '@reduxjs/toolkit';
import { sendEmail } from './emailSendThunk';

const initialState = {
  loading: false,
  error: null,
  lastSent: null
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    clearEmailError: (state) => {
      state.error = null;
    },
    clearLastSentEmail: (state) => {
      state.lastSent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSent = action.meta.arg;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to send email';
      });
  }
});

export const { clearEmailError, clearLastSentEmail } = emailSlice.actions;
export default emailSlice.reducer;
