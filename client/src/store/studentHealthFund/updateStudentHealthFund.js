import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateStudentHealthFund = createAsyncThunk(
  'studentHealthFund/update',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/StudentHealthFund/Update`, studentHealthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update student health fund');
    }
  }
);
