import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteLesson = createAsyncThunk(
  'lessons/deleteLesson',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/Lesson/delete/${id}`);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);