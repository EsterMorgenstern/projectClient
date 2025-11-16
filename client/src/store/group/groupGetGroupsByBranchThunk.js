import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupsByBranch = createAsyncThunk(
  'groups/getGroupsByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching groups by branch ID:', branchId);
      const response = await axios.get(`${API_BASE_URL}/Group/GetGroupsByBranch/${branchId}`);
      console.log('✅ Groups by branch data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching groups by branch:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);