import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBranches= createAsyncThunk(
  'branches/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5248/api/Branch/GetAll');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 