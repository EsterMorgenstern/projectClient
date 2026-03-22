import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getLessonsByDateRange = createAsyncThunk(
  'lessons/getLessonsByDateRange',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Lesson/ByDateRange`, {
        params: { startDate, endDate }
      });

      return {
        startDate,
        endDate,
        lessons: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
