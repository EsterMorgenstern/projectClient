import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getGroupsByDay= createAsyncThunk(
  'groups/getGroupsByDay',
  async (day, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Group/GetGroupsByDay/${day}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching groups by day:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'שגיאה בטעינת קבוצות';
      
      return rejectWithValue(errorMessage);
    }
  }
);
