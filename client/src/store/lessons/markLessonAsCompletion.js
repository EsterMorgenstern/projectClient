import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const markLessonAsCompletion = createAsyncThunk(
  'lessons/markLessonAsCompletion',
  async ({ id, markedBy }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Lesson/mark-as-completion/${id}`, null, {
        params: { markedBy }
      });
      return { id, markedBy, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
