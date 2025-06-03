import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceHistory = createAsyncThunk(
    'attendance/fetchAttendanceHistory',
    async ({ groupId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
               `https://localhost:5248/api/attendance/student/${student.id}/history?month=${selectedMonth}&year=${selectedYear}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance range');
        }
    }
);