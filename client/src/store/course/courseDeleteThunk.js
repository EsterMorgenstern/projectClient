import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Course/Delete?courseId=${courseId}`);
            return { courseId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
