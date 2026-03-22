import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// thunk לשליפת שיעורים לפי תאריך
export const fetchLessonsByDate = createAsyncThunk(
  'lessons/fetchByDate',
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Lesson/ByDate?date=${date}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
