import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const groupStudentAddThunk = createAsyncThunk(
  'groupStudent/addGroupStudent',
  async (groupStudentData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`http://localhost:5248/api/GroupStudent/Add`, groupStudentData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student course');
    }
  }
);

  