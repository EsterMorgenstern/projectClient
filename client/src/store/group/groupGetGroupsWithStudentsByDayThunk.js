import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupsWithStudentsByDay = createAsyncThunk(
  'groups/getGroupsWithStudentsByDay',
  async (day, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching groups with students by day:', day);
      const response = await axios.get(`${API_BASE_URL}/Group/GetGroupsWithStudentsByDay/${encodeURIComponent(day)}`);
      console.log('✅ Groups with students by day data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching groups with students by day:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
