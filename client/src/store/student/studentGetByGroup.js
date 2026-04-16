import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getStudentsByGroupId= createAsyncThunk(
  'students/GetStudentsByGroupId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Group/GetStudentsByGroupId/${id}`);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.data)) {
        return payload.data;
      }

      if (Array.isArray(payload?.students)) {
        return payload.students;
      }

      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'An error occurred'
      );
    }
  }
);
 