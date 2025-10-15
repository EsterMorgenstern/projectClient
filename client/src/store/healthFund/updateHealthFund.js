import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateHealthFund = createAsyncThunk(
  'healthFund/update',
  async (healthFund, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/HealthFund/Update`, healthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update health fund');
    }
  }
);
