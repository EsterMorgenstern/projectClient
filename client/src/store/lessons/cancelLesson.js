import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const cancelLesson = createAsyncThunk(
  'lessons/cancelLesson',
  async ({ id, reason, canceledBy }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Lesson/cancel/${id}`, null, {
        params: { reason, canceledBy }
      });
      return { id, reason, canceledBy, data: response.data };
    } catch (error) {
        console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
