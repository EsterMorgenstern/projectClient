import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceHistory = createAsyncThunk(
    'attendance/fetchAttendanceHistory',
    async ({ studentId, selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);
            
            // ה-URL הנכון בהתאם ל-Controller שלך
            const url = `http://localhost:5248/api/Attendance/student/${studentId}/history${params.toString() ? `?${params.toString()}` : ''}`;
            
            console.log('Fetching attendance history from URL:', url);
            const response = await axios.get(url);
            console.log('Attendance history response:', response.data);
            return response.data;
        } catch (error) {
            console.error('fetchAttendanceHistory error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance history');
        }
    }
);
