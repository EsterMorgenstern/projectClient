import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const sendEmail = createAsyncThunk(
  'email/sendEmail',
  async ({ to, subject, body }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Email/send`, {
        to,
        subject,
        body
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to send email');
    }
  }
);
