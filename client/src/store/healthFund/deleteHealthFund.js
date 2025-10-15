import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteHealthFund = createAsyncThunk(
  'healthFund/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/HealthFund/Delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete health fund');
    }
  }
);
