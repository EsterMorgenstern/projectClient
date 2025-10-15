import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addHealthFund = createAsyncThunk(
  'healthFund/add',
  async (healthFund, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/HealthFund/Add`, healthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add health fund');
    }
  }
);
