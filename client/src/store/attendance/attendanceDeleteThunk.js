import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteAttendance = createAsyncThunk(
    'courses/deleteAttendance',
    async (attendanceId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Attendance/Delete?attendanceId=${attendanceId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete attendance');
        }
    }
);
