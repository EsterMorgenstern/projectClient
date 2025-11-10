import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';

export const getGroupStudentByStudentName = createAsyncThunk(
  'groupStudent/getByStudentName',
  async ({ firstName, lastName }, { rejectWithValue }) => {
    try {
      console.log('🔍 Searching for student by name:', firstName, lastName);
      
      const encodedFirstName = encodeURIComponent(firstName);
      const encodedLastName = encodeURIComponent(lastName);
      
      const response = await fetch(
        `${API_BASE_URL}/GroupStudent/GetByStudentName/${encodedFirstName}/${encodedLastName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to fetch student by name:', response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Student data found by name:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in getGroupStudentByStudentName:', error);
      return rejectWithValue(error.message);
    }
  }
);
