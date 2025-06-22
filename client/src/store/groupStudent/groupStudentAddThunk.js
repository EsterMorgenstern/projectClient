import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const groupStudentAddThunk = createAsyncThunk(
  'groupStudent/addGroupStudent',
  async (groupStudentData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${API_BASE_URL}/GroupStudent/Add`, groupStudentData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student course');
    }
  }
);

  