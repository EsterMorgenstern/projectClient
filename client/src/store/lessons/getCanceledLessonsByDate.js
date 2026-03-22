import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getCanceledLessonsByDate = createAsyncThunk(
  'lessons/getCanceledLessonsByDate',
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Lesson/canceled/${date}`);
      return { date, lessons: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
