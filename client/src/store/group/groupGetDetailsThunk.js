import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupDetails = createAsyncThunk(
  'groups/getGroupDetails',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Group/details/${groupId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
