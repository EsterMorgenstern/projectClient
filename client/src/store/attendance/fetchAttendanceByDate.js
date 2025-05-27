import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceByDate = createAsyncThunk(
    'attendance/fetchAttendanceByDate',
    async ({ groupId, date }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5248/api/Attendance/GetAttendance/${groupId}/${date}`
            );
            return { date, attendance: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance');
        }
    }
);