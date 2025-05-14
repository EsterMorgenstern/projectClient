import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGroups= createAsyncThunk(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5248/api/Group/GetAll');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 