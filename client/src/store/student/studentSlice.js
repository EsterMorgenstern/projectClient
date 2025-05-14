import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchStudents } from './studentGetAllThunk';
import { addStudent } from './studentAddThunk';
import { deleteStudent } from './studentDeleteThunk';
import { editStudent } from './studentEditThunk';
import { getStudentById } from './studentGetByIdThunk';


const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
    studentById:[]
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
//getStudentById
      .addCase(getStudentById.pending, (state) => {
        console.log('getStudentById...');
        state.loading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.studentById = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        console.error('Error getStudentById:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

//editStudent
      .addCase(editStudent.pending, (state) => {
        console.log('editStudent...');
        state.loading = true;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
       const updatedStudents = state.students.map((student) =>
        student.id === action.payload.id ? action.payload : student
      )
      state.instructors = updatedStudents;
      })
      .addCase(editStudent.rejected, (state, action) => {
        console.error('Error editStudent:', action.error.message);
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
      });
      
  },
});

export default studentsSlice.reducer;
