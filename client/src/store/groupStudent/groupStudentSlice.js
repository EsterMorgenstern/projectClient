import { createSlice } from '@reduxjs/toolkit';
import { getgroupStudentByStudentId } from './groupStudentGetByStudentIdThunk';
import { groupStudentAddThunk } from './groupStudentAddThunk';

const groupStudentSlice = createSlice({
  name: 'groupStudent',
  initialState: {
    groupStudent: [],
    loading: false,
    error: null,
    groupStudentById: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getgroupStudentByStudentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getgroupStudentByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.groupStudentById = action.payload;
      })  
      .addCase(getgroupStudentByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student courses';
      }) 
//groupStudentAddThunk
       .addCase(groupStudentAddThunk.pending, (state) => {    
        console.log('groupStudentAddThunk...');
        state.loading = true; 
       }) 
       .addCase(groupStudentAddThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groupStudent.push(action.payload); // Add the new student course to the state
        console.log(action.payload);
      })  
      .addCase(groupStudentAddThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to addStudentCourse';
      }) ;   
  }
}); 
export default groupStudentSlice.reducer;
