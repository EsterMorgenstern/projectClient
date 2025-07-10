import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getCancellationDetailsByDate = createAsyncThunk(
    'lessonsCancelation/getCancellationDetailsByDate',
    async (date, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/LessonCancellations/GetCancellationDetailsByDate`, {
                params: { date }
            });
            
            return {
                date,
                cancellationDetails: response.data
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'שגיאה בקבלת פרטי הביטולים'
            );
        }
    }
);
