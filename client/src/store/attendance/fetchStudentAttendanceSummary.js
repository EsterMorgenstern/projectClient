import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudentAttendanceSummary = createAsyncThunk(
    'attendance/fetchStudentSummary',
    async ({ studentId, month, year }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
`https://localhost:5248/api/attendance/student/${studentId}/summary?month=${month}&year=${year}`            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance range');
        }
    }
);