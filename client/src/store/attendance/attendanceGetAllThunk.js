import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendances= createAsyncThunk(
  'attendances/fetchAttendances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5248/api/Attendance/GetAll');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 