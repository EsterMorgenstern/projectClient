import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const createCompletionLesson = createAsyncThunk(
  'lessons/createCompletionLesson',
  async ({ groupId, completionDate, completionHour, instructorId, createdBy }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Lesson/completion/create`, null, {
        params: { groupId, completionDate, completionHour, instructorId, createdBy }
      });
      return { groupId, completionDate, completionHour, instructorId, createdBy, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
