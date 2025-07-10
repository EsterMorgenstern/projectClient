import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const isMarkedForDay = createAsyncThunk(
  'attendance/isMarkedForDay',
  async ({ date }, { rejectWithValue }) => {
    try {
      console.log(`🔍 Checking attendance on ${date}`);
      
      const response = await axios.get(`${API_BASE_URL}/Attendance/IsAttendanceMarkedForDay/${date}`);

      console.log(`✅ Attendance check result for ${date}:`, response.data);

      return {
        date,
        isMarked: response.data === true || response.data.isMarked === true,
        key: `${date}`
      };
    } catch (error) {
      console.error(`❌ Error checking attendance for ${date}:`, error);

      // אם השגיאה היא 404, זה אומר שאין נוכחות - זה לא באמת שגיאה
      if (error.response?.status === 404) {
        return {
          date,
          isMarked: false,
          key: `${date}`
        };
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || 'שגיאה בבדיקת נוכחות',
        date,
        key: `${date}`
      });
    }
  }
);
