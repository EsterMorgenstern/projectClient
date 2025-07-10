import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const cancelAllGroupsForDay = createAsyncThunk(
    'lessonsCancelation/cancelAllGroupsForDay',
    async ({ dayOfWeek, date, reason, createdBy }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/LessonCancellations/CancelAllGroupsForDay`, {
                dayOfWeek,
                date,
                reason,
                createdBy
            });
            
            return {
                dayOfWeek,
                date,
                reason,
                createdBy,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'שגיאה בביטול השיעורים'
            );
        }
    }
);
