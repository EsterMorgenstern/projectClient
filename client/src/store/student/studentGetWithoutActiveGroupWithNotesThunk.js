import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';

export const fetchStudentsWithoutActiveGroupWithNotes = createAsyncThunk(
  'student/fetchWithoutActiveGroupWithNotes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_BASE_URL}/Student/students-without-active-group-with-notes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch students without active group');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
