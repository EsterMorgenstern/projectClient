import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getNotesByStudentId= createAsyncThunk(
  'studentNote/GetNotesByStudentId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentNotes/getById/${id}`);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.result)) {
        return payload.result;
      }

      if (Array.isArray(payload?.data)) {
        return payload.data;
      }

      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 