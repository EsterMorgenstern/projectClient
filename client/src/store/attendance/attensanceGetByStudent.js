import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

// thunk לקבלת כל רשומות הנוכחות של תלמיד לפי מזהה
export const getAttendanceByStudent = createAsyncThunk(
  'attendance/getAttendanceByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Attendance/GetAttendanceByStudent/${studentId}`);
      return response.data; // מערך של רשומות נוכחות
    } catch (error) {
      return rejectWithValue(error.response?.data || 'שגיאה בשליפת נוכחות');
    }
  }
);