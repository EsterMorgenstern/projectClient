import { createSlice } from '@reduxjs/toolkit';
import { fetchAttendances } from './attendanceGetAllThunk';

const attendanceSlice = createSlice({
  name: 'attendances',
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
// getAllBranches
      .addCase(fetchAttendances.pending, (state) => {
        console.log('Fetching branches...');
        state.loading = true;
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        console.error('Error fetching branches:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
      

      
  },
});

export default attendanceSlice.reducer;
