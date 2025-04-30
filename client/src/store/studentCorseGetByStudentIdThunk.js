import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getStudentCoursesByStudentId = createAsyncThunk(
    'studentCourses/getByIdStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://localhost:5000/api/StudentCourse/getByIdStudent/${studentId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get student courses');
        }
    }
);
