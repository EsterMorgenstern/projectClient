import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getStudentById= createAsyncThunk(
  'students/GetStudentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5248/api/Student/getById/${id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 