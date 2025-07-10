import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const checkCancellationsForDay = createAsyncThunk(
    'lessonsCancelation/checkCancellationsForDay',
    async ({ dayOfWeek, date }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/LessonCancellations/HasCancellationsForDay`, {
                params: { dayOfWeek, date }
            });
            
            return {
                dayOfWeek,
                date,
                hasCancellations: response.data.hasCancellations,
                cancellationsCount: response.data.cancellationsCount
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'שגיאה בבדיקת הביטולים'
            );
        }
    }
);
