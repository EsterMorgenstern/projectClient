import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getCompletionLessonsByGroupId = createAsyncThunk(
  'lessons/getCompletionLessonsByGroupId',
  async ({ groupId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Lesson/completion/by-group/${groupId}`);
      return { groupId, lessons: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
