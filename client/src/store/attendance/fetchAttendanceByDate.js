import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendanceByDate = createAsyncThunk(
    'attendance/fetchAttendanceByDate',
    async ({ groupId, date }, { rejectWithValue }) => {
        try {
            let formattedDate = date;
            if (date instanceof Date) {
                formattedDate = date.toISOString().split('T')[0];
            } else if (typeof date === 'string') {
                const dateObj = new Date(date);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toISOString().split('T')[0];
                }
            }

            console.log('Sending request with:', { groupId, formattedDate });
            
            const response = await axios.get(
                `http://localhost:5248/api/Attendance/GetAttendanceByGroupAndDate/${groupId}/${formattedDate}`
            );
            
            return { date: formattedDate, attendance: response.data };
        } catch (error) {
            console.error('Error fetching attendance:', error.response?.data || error.message);
            
            // זמנית - החזר מערך רק במקום שגיאה
            if (error.response?.status === 400 && error.response?.data?.includes('not implemented')) {
                console.warn('Server method not implemented, returning empty array');
                return { date: formattedDate, attendance: [] };
            }
            
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance');
        }
    }
);
