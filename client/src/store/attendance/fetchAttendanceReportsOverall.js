
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceReportsOverall = createAsyncThunk(
    'attendance/fetchAttendanceReportsOverall',
    async ({ selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            const url = `http://localhost:5248/api/Attendance/reports/overall?month=${selectedMonth}&year=${selectedYear}`;
            
            console.log('Fetching overall attendance reports from URL:', url);
            
            const response = await axios.get(url);
            
            console.log('Overall attendance reports response:', response.data);
            console.log('Response status:', response.status);
            
            return response.data;
        } catch (error) {
            console.error('fetchAttendanceReportsOverall error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url
            });
            
            // החזרת שגיאה מפורטת יותר
            const errorMessage = error.response?.data?.message || 
                               error.response?.data || 
                               `HTTP ${error.response?.status}: ${error.response?.statusText}` ||
                               error.message ||
                               'Failed to fetch overall attendance reports';
                               
            return rejectWithValue(errorMessage);
        }
    }
);
