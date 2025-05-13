import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchStudents } from './studentGetAllThunk';
import { addStudent } from './studentAddThunk';
import { deleteStudent } from './studentDeleteThunk';

// export const updateStudent = createAsyncThunk('students/updateStudent', async (student) => {
//   const response = await axios.put(`https://localhost:5248/api/Student/UpdateStudent/${student.id}`, student);
//   return response.data;
// });

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
//fetchStudents   
       .addCase(fetchStudents.pending, (state) => {
        debugger
        console.log('Fetching students...');
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        console.error('Error fetching students:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
//addStudent      
      .addCase(addStudent.pending, (state) => {
        console.log('addStudent...');
        state.loading = true;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.students.push(action.payload); // Add the new student to the state
      })
      .addCase(addStudent.rejected, (state, action) => {
        console.error('Error addStudent:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
//deleteStudent     
      .addCase(deleteStudent.pending, (state) => {
        console.log('deleteStudent...');
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.students = state.students.filter((student) => student.id !== action.payload.id);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        console.error('Error deleteStudent:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      // .addCase(updateStudent.fulfilled, (state, action) => {
      //   const updatedStudents = state.students.map((student) =>
      //     student.id === action.payload.id ? action.payload : student
      //   );
      //   state.students = updatedStudents;
      // });
  },
});

export default studentsSlice.reducer;
