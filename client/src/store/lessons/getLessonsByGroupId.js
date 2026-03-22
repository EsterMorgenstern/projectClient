import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getLessonsByGroupId = createAsyncThunk(
  'lessons/getLessonsByGroupId',
  async ({ groupId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Lessons/by-group/${groupId}`);
      return { groupId, lessons: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
