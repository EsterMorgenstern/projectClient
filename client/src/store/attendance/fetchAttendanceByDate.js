import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';
import { normalizeAttendanceList } from './normalizeAttendanceRecord';

const isEndpointNotAvailable = (status, errorText = '') => {
  const lowered = String(errorText).toLowerCase();
  return status === 400 || status === 404 || lowered.includes('not implemented');
};

export const fetchAttendanceByDate = createAsyncThunk(
  'attendance/fetchAttendanceByDate',
  async ({ groupId, date }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Attendance/GetAttendanceByGroupAndDate/${groupId}/${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Some backend environments return 400/404 or "not implemented" when no data API is unavailable.
        if (isEndpointNotAvailable(response.status, errorText)) {
          return { date, attendance: [] };
        }

        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const normalizedAttendance = normalizeAttendanceList(data);

      return { date, attendance: normalizedAttendance };
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      return rejectWithValue(error.message || 'שגיאה בטעינת הנוכחות');
    }
  }
);
