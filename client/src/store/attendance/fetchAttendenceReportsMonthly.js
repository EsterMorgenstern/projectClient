import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceReportsMonthly = createAsyncThunk(
    'attendance/fetchAttendanceReportsMonthly',
    async ({ groupId, selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            // בניית URL נכונה
            let url = `http://localhost:5248/api/Attendance/reports/monthly?month=${selectedMonth}&year=${selectedYear}`;
            
            // הוספת groupId רק אם הוא קיים ולא ריק
            if (groupId && groupId !== '') {
                url += `&groupId=${groupId}`;
            }
            
            console.log('Fetching monthly attendance reports from URL:', url);
            
            const response = await axios.get(url);
            
            console.log('Monthly attendance reports response:', response.data);
            console.log('Response status:', response.status);
            
            // וודא שהתגובה תקינה
            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                throw new Error('Invalid response from server');
            }
            
        } catch (error) {
            console.error('fetchAttendanceReportsMonthly error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url
            });
            
            return rejectWithValue(
                error.response?.data || 
                error.message || 
                'Failed to fetch monthly attendance reports'
            );
        }
    }
);
