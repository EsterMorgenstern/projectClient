import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const undoCancelLesson = createAsyncThunk(
  'lessons/undoCancelLesson',
  async ({ id, undoBy }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Lesson/undo-cancel/${id}`, null, {
        params: { undoBy }
      });
      return { id, undoBy, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
