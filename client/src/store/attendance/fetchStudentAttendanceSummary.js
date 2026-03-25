import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchStudentAttendanceSummary = createAsyncThunk(
    'attendance/fetchStudentAttendanceSummary',
    async ({ studentId, month, year }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (month) params.append('month', month);
            if (year) params.append('year', year);

            const url = `${API_BASE_URL}/Attendance/student/${studentId}/summary${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || 'שגיאה בטעינת סיכום נוכחות התלמיד');
        }
    }
);
