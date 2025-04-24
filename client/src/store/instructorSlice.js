import { createSlice } from '@reduxjs/toolkit';
import { fetchInstructors } from './instructorGetAllThunk';
import { addInstructor } from './instructorAddThunk';
import { deleteInstructor } from './instuctorDeleteThunk';
import { editInstructor } from './instructorEditThunk';



const instructorsSlice = createSlice({
  name: 'instructors',
  initialState: {
    instructors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
//fetchInstructors    
      .addCase(fetchInstructors.pending, (state) => {
        console.log('Fetching instructors...');
        state.loading = true;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        console.error('Error fetching instructors:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
//addInstructor          
      .addCase(addInstructor.pending, (state) => {
        console.log('addInstructor...');
        state.loading = true;
      })
      .addCase(addInstructor.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.instructors.push(action.payload); // Add the new student to the state 
      })
      .addCase(addInstructor.rejected, (state, action) => {
        console.error('Error addInstructor:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
//deleteInstructor      
      .addCase(deleteInstructor.pending, (state) => {
        console.log('deleteInstructor...');
        state.loading = true;
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.instructors = state.instructors.filter((instructor) => instructor.id !== action.payload.id);
      })
      .addCase(deleteInstructor.rejected, (state, action) => {
        console.error('Error deleteInstructor:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
    //updateInstructor          
    .addCase(editInstructor.pending, (state) => {
      console.log('updateInstructor...');
      state.loading = true;
    })
    .addCase(editInstructor.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      const updatedInstructors = state.instructors.map((instructor) =>
        instructor.id === action.payload.id ? action.payload : instructor
      );
      state.instructors = updatedInstructors;
    })
    .addCase(editInstructor.rejected, (state, action) => {
      console.error('Error updateInstructor:', action.error.message);
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default instructorsSlice.reducer;
