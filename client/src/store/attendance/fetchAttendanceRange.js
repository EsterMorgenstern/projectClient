import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceRange = createAsyncThunk(
    'attendance/fetchAttendanceRange',
    async ({ groupId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5248/api/Attendance/GetAttendanceRange/${groupId}/${startDate}/${endDate}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance range');
        }
    }
);