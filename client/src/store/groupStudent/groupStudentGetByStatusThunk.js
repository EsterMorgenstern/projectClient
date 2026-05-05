import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupStudentsByStatus = createAsyncThunk(
  'groupStudent/getByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/GroupStudent/GetByStatus/${status}`;
      console.log('🔄 [getGroupStudentsByStatus] fetching:', url);
      const response = await axios.get(url);
      console.log('✅ [getGroupStudentsByStatus] response status:', response.status);
      console.log('✅ [getGroupStudentsByStatus] data length:', Array.isArray(response.data) ? response.data.length : response.data);
      console.log('✅ [getGroupStudentsByStatus] first item:', response.data?.[0]);
      return response.data;
    } catch (error) {
      console.error('❌ [getGroupStudentsByStatus] error:', error.message);
      console.error('❌ [getGroupStudentsByStatus] response:', error.response?.data);
      console.error('❌ [getGroupStudentsByStatus] status code:', error.response?.status);
      return rejectWithValue(error.response?.data || 'Failed to get group students by status');
    }
  }
);

