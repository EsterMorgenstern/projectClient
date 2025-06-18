import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserById= createAsyncThunk(
  'user/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5248/api/User/getById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 