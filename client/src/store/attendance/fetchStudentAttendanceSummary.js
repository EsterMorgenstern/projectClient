import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';

export const fetchStudentAttendanceSummary = createAsyncThunk(
    'attendance/fetchStudentAttendanceSummary',
    async ({ studentId, month, year }, { rejectWithValue }) => {
        try {
            console.log('📊 Fetching student attendance summary:', { studentId, month, year });
            
            let url = `${API_BASE_URL}/Attendance/student/${studentId}/summary`;
            const params = new URLSearchParams();
            
            if (month) params.append('month', month);
            if (year) params.append('year', year);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
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
            console.log('✅ Student attendance summary fetched:', data);
            
            return data;
        } catch (error) {
            console.error('❌ Error fetching student attendance summary:', error);
            return rejectWithValue(error.message || 'שגיאה בטעינת סיכום נוכחות התלמיד');
        }
    }
);
