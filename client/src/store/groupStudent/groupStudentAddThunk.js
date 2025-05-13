import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const groupStudentAddThunk = createAsyncThunk(
  'groupStudent/addGroupStudent',
  async (studentCourseData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://localhost:5000/api/GroupStudent/Add', studentCourseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student course');
    }
  }
);

  