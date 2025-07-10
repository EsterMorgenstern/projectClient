// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const addLessonCancellation = createAsyncThunk(
//   'lessonCancellations/add',
//   async (data, thunkAPI) => {
//     try {
//       const res = await axios.post(`${API_URL}/LessonCancellations/Add`, data);
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addLessonCancellation = createAsyncThunk(
    'lessonCancellations/add',
    async (cancellationData, { rejectWithValue }) => {
        try {
            console.log('🚀 Adding lesson cancellation:', cancellationData);
            
            // וידוא שהנתונים נשלחים בפורמט הנכון
            const payload = {
                groupId: parseInt(cancellationData.groupId),
                date: cancellationData.date,
                reason: cancellationData.reason.trim(),
                created_at:  new Date().toISOString().split('T')[0],
                created_by: cancellationData.created_by || 'system'
            };
            console.log('Payload for cancellation:', payload);
            const response = await axios.post(
                `${API_BASE_URL}/LessonCancellations/Add`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('✅ Cancellation added successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error adding cancellation:', error);
            
            // טיפול מפורט בשגיאות
            if (error.response) {
                // שגיאה מהשרת
                console.error('Server error:', error.response.data);
                console.error('Status:', error.response.status);
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                // בעיית רשת
                console.error('Network error:', error.request);
                return rejectWithValue('שגיאת רשת - אין תגובה מהשרת');
            } else {
                // שגיאה אחרת
                console.error('Error:', error.message);
                return rejectWithValue(error.message);
            }
        }
    }
);
