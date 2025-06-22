import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchStudentAttendanceSummary = createAsyncThunk(
    'attendance/fetchStudentSummary',
    async ({ studentId, month, year }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (month) params.append('month', month);
            if (year) params.append('year', year);
            
            const url = `${API_BASE_URL}/Attendance/student/${studentId}/summary${params.toString() ? `?${params.toString()}` : ''}`;
            
            console.log('Fetching attendance summary from URL:', url);
            const response = await axios.get(url);
            console.log('Attendance summary response:', response.data);
            return response.data;
        } catch (error) {
            console.error('fetchStudentAttendanceSummary error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance summary');
        }
    }
);
