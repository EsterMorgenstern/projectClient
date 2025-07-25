import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchAttendanceReportsMonthly = createAsyncThunk(
    'attendance/fetchAttendanceReportsMonthly',
    async ({ groupId, selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            let url = `${API_BASE_URL}/Attendance/reports/monthly?month=${selectedMonth}&year=${selectedYear}`;
            
            if (groupId) {
                url += `&groupId=${groupId}`;
            }
            
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('fetchAttendanceReportsMonthly error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue(error.response?.data || 'Failed to fetch monthly attendance reports');
        }
    }
);
