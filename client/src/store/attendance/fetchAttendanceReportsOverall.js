import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceReportsOverall = createAsyncThunk(
    'attendance/fetchAttendanceReportsOverall',
    async ({ selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            const url = `http://localhost:5248/api/Attendance/reports/overall?month=${selectedMonth}&year=${selectedYear}`;
            
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('fetchAttendanceReportsOverall error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue(error.response?.data || 'Failed to fetch overall attendance reports');
        }
    }
);
