import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';

export const fetchAttendanceByDate = createAsyncThunk(
    'attendance/fetchAttendanceByDate',
    async ({ groupId, date }, { rejectWithValue }) => {
        try {
            console.log('📅 Fetching attendance for group:', groupId, 'date:', date);
            
            const response = await fetch(`${API_BASE_URL}/Attendance/GetAttendanceByGroupAndDate/${groupId}/${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Attendance fetched successfully:', data);
            
            return { date, attendance: data || [] };
        } catch (error) {
            console.error('❌ Error fetching attendance:', error);
            return rejectWithValue(error.message || 'שגיאה בטעינת הנוכחות');
        }
    }
);
