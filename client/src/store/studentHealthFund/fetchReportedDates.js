import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchReportedDates = createAsyncThunk(
  'studentHealthFund/fetchReportedDates',
  async (studentHealthFundId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/${studentHealthFundId}/reported-dates`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching reported dates');
    }
  }
);