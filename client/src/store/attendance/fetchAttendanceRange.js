import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchAttendanceRange = createAsyncThunk(
    'attendance/fetchAttendanceRange',
    async ({ groupId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/Attendance/GetAttendanceRange/${groupId}/${startDate}/${endDate}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance range');
        }
    }
);