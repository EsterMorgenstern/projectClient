import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (course, { rejectWithValue }) => {
        try {
            const response = axios.delete(`${API_BASE_URL}/Course/Delete`, {
                data: course
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
