import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const cancelAllGroupsForDay = createAsyncThunk(
  'lessons/cancelAllGroupsForDay',
  async ({ dayOfWeek, date, reason, createdBy }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Lesson/cancel-all-for-day`, null, {
        params: { dayOfWeek, date, reason, createdBy }
      });
      return { dayOfWeek, date, reason, createdBy, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
