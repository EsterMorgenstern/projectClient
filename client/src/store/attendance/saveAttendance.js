import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const saveAttendance = createAsyncThunk(
    'attendance/saveAttendance',
    async (attendanceData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
               `${API_BASE_URL}/Attendance/SaveAttendanceForDate`, attendanceData
             
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to save attendance');
        }
    }
);