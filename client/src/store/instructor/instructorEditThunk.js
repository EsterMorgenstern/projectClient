import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const editInstructor = createAsyncThunk(
    'instructors/editInstructor',
    async (instructor, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5248/api/Instructor/Update`, instructor);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
