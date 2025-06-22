import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const editInstructor = createAsyncThunk(
    'instructors/editInstructor',
    async (instructor, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Instructor/Update`, instructor);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
