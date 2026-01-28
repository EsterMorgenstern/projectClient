import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteHealthFund = createAsyncThunk(
  'healthFund/delete',
  async (id, { rejectWithValue }) => {
    try {
      // The backend expects DELETE /HealthFund/Delete?healthFundId=ID
      await axios.delete(`${API_BASE_URL}/HealthFund/Delete`, { params: { healthFundId: id } });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete health fund');
    }
  }
);
