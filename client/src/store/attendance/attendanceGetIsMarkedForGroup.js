import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const isMarkedForDate = createAsyncThunk(
  'attendance/isMarkedForDate',
  async ({ groupId, date }, { rejectWithValue }) => {
    try {
      console.log(`🔍 Checking attendance for group ${groupId} on ${date}`);
      
      const response = await axios.get(`${API_BASE_URL}/Attendance/IsAttendanceMarkedForGroup/${groupId}/${date}`);

      console.log(`✅ Attendance check result for group ${groupId}:`, response.data);
      
      return {
        groupId,
        date,
        isMarked: response.data === true || response.data.isMarked === true,
        key: `${groupId}-${date}`
      };
    } catch (error) {
      console.error(`❌ Error checking attendance for group ${groupId}:`, error);
      
      // אם השגיאה היא 404, זה אומר שאין נוכחות - זה לא באמת שגיאה
      if (error.response?.status === 404) {
        return {
          groupId,
          date,
          isMarked: false,
          key: `${groupId}-${date}`
        };
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || 'שגיאה בבדיקת נוכחות',
        groupId,
        date,
        key: `${groupId}-${date}`
      });
    }
  }
);
