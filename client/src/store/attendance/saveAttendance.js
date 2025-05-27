import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const saveAttendance = createAsyncThunk(
    'attendance/saveAttendance',
    async (attendanceData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5248/api/Attendance/SaveAttendance',
                attendanceData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to save attendance');
        }
    }
);