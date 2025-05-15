import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getgroupStudentByStudentId = createAsyncThunk(
    'groupStudent/getByIdStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5248/api/GroupStudent/getByStudentId/${studentId}`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get student courses');
        }
    }
);
