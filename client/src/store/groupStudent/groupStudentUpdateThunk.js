import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL  from '../../config/api';

export const updateGroupStudent = createAsyncThunk(
  'groupStudent/updateGroupStudent',
  async (updateData, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating group student with data:', updateData);
      const response = await axios.put(`${API_BASE_URL}/GroupStudent/Update`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
