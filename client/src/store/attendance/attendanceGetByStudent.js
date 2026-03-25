import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { normalizeAttendanceList } from './normalizeAttendanceRecord';

// thunk לקבלת כל רשומות הנוכחות של תלמיד לפי מזהה
export const getAttendanceByStudent = createAsyncThunk(
  'attendance/getAttendanceByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Attendance/student/${studentId}/history`);
      const payload = response.data?.result ?? response.data;
      return normalizeAttendanceList(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'שגיאה בשליפת נוכחות');
    }
  }
);