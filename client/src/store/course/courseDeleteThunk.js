import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (course, { rejectWithValue }) => {
        try {
            const response = axios.delete(`http://localhost:5248/api/Course/Delete`, {
                data: course
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
