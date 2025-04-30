import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addStudentCourse = createAsyncThunk(
  'studentCourses/addStudentCourse',
  async (studentCourseData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://localhost:5000/api/StudentCourse/Add', studentCourseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student course');
    }
  }
);

  