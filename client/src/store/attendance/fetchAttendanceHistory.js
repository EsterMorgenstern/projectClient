import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchAttendanceHistory = createAsyncThunk(
    'attendance/fetchAttendanceHistory',
    async ({ studentId, selectedMonth, selectedYear }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);
            
            // ה-URL הנכון בהתאם ל-Controller שלך
            const url = `${API_BASE_URL}/Attendance/student/${studentId}/history${params.toString() ? `?${params.toString()}` : ''}`;
            
            console.log('📡 Fetching attendance history from URL:', url);
            console.log('📋 Request parameters:', { studentId, selectedMonth, selectedYear, paramsString: params.toString() });
            const response = await axios.get(url);
            console.log('🔍 Attendance history raw response:', response.data);
            console.log('🔍 Response structure:', {
                hasResult: 'result' in response.data,
                resultType: Array.isArray(response.data?.result) ? 'array' : typeof response.data?.result,
                resultLength: Array.isArray(response.data?.result) ? response.data.result.length : 'N/A',
                directDataType: Array.isArray(response.data) ? 'array' : typeof response.data
            });
            return response.data;
        } catch (error) {
            console.error('fetchAttendanceHistory error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance history');
        }
    }
);
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import API_BASE_URL from '../../config/api';

// export const fetchAttendanceHistory = createAsyncThunk(
//     'attendance/fetchAttendanceHistory',
//     async ({ studentId, month, year }, { rejectWithValue }) => {
//         try {
//             console.log('📚 Fetching attendance history:', { studentId, month, year });
            
//             let url = `${API_BASE_URL}/Attendance/student/${studentId}/history`;
//             const params = new URLSearchParams();
            
//             if (month) params.append('month', month);
//             if (year) params.append('year', year);
            
//             if (params.toString()) {
//                 url += `?${params.toString()}`;
//             }

//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || `HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log('✅ Attendance history fetched:', data);
            
//             return data;
//         } catch (error) {
//             console.error('❌ Error fetching attendance history:', error);
//             return rejectWithValue(error.message || 'שגיאה בטעינת היסטוריית הנוכחות');
//         }
//     }
// );
