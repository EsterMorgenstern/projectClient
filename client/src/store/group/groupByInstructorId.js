import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupsByInstructorId= createAsyncThunk(
  'groups/GetGroupsByInstructorId',
  async (id, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${API_BASE_URL}/Group/getGroupsByInstructorId/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 