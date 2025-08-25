import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getStudentNotesByRegistrationTracking = createAsyncThunk(
  'studentNotes/getByRegistrationTracking',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentNotes/getByRegistrationTracking`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching registration tracking notes');
    }
  }
);
