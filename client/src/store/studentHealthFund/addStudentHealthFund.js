import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addStudentHealthFund = createAsyncThunk(
  'studentHealthFund/add',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/StudentHealthFund/Add`, studentHealthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student health fund');
    }
  }
);
