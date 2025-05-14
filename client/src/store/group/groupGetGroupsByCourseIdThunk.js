import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getGroupsByCourseId= createAsyncThunk(
  'groups/GetGroupsByCourseId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5248/api/Group/GetGroupsByCourseId/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 