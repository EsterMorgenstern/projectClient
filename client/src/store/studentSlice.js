import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// קריאות לשרת
export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await axios.get('https://localhost:5000/api/Student/GetAll');
  return response.data;
});

export const addStudent = createAsyncThunk('students/addStudent', async (student) => {
  const response = await axios.post('https://localhost:5000/api/Student/Addstudent', student);
  return response.data;
});

export const updateStudent = createAsyncThunk('students/updateStudent', async (student) => {
  const response = await axios.put(`https://localhost:5000/api/Student/UpdateStudent/${student.id}`, student);
  return response.data;
});

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
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const updatedStudents = state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        );
        state.students = updatedStudents;
      });
  },
});

export default studentsSlice.reducer;
