import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const batchUpdateAttendances = createAsyncThunk(
    'attendance/batchUpdateAttendances',
    async (attendances, { rejectWithValue }) => {
        try {
            const response = await axios.post(
               `${API_BASE_URL}/Attendance/batch-update`, attendances
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to save attendance');
        }
    }
);
