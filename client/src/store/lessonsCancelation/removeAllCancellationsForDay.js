import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const removeAllCancellationsForDay = createAsyncThunk(
    'lessonsCancelation/removeAllCancellationsForDay',
    async ({ dayOfWeek, date }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/LessonCancellations/RemoveAllCancellationsForDay`, {
                params: { dayOfWeek, date }
            });
            
            return {
                dayOfWeek,
                date,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'שגיאה בהסרת הביטולים'
            );
        }
    }
);
