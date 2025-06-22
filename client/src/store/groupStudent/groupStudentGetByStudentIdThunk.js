import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getgroupStudentByStudentId = createAsyncThunk(
    'groupStudent/getByIdStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/GroupStudent/getByStudentId/${studentId}`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get student courses');
        }
    }
);
