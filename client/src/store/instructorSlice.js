import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// קריאות לשרת
export const fetchInstructors = createAsyncThunk('instructors/fetchInstructors', async () => {
  const response = await axios.get('https://localhost:5000/api/Instructor/GetAll');
  return response.data;
});

export const addInstructor = createAsyncThunk('instructors/addInstructor', async (instructor) => {
  const response = await axios.post('https://localhost:5000/api/instructor/Add', instructor);
  return response.data;
});

export const updateInstructor = createAsyncThunk('instructors/updateInstructor', async (instructor) => {
  const response = await axios.put(`https://localhost:5000/api/Instructor/Update/${instructor.id}`, student);
  return response.data;
});

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
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInstructor.fulfilled, (state, action) => {
        state.instructors.push(action.payload);
      })
      .addCase(updateInstructor.fulfilled, (state, action) => {
        const updateInstructor = state.instructor.map((instructor) =>
            instructor.id === action.payload.id ? action.payload : instructor
        );
        state.instructors = updateInstructor;
      });
  },
});

export default instructorsSlice.reducer;
