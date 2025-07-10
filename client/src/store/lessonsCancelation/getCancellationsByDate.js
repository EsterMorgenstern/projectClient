import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getCancellationsByDate = createAsyncThunk(
    'lessonsCancelation/getCancellationsByDate',
    async (date, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/LessonCancellations/GetCancellationsByDate`, {
                params: { date }
            });
            
            return {
                date,
                cancellations: response.data
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'שגיאה בקבלת הביטולים'
            );
        }
    }
);
