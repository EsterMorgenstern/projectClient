
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateLessonCancellation = createAsyncThunk(
    'lessonCancellations/update',
    async (cancellationData, { rejectWithValue }) => {
        try {
            console.log('🚀 Updating lesson cancellation:', cancellationData);
            
            const payload = {
                id: cancellationData.id,
                groupId: parseInt(cancellationData.groupId),
                date: cancellationData.date,
                reason: cancellationData.reason.trim(),
                created_by: cancellationData.created_by || 'system',
                created_at:  cancellationData.created_at || new Date().toISOString().split('T')[0],

            };

            const response = await axios.put(`${API_BASE_URL}/LessonCancellations/Update`, payload);
            console.log('✅ Cancellation updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating cancellation:', error);
            
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue('שגיאת רשת - אין תגובה מהשרת');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);
