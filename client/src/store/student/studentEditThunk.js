import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const editStudent = createAsyncThunk(
    'students/editStudent',
    async (student, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5248/api/Student/Update`, student);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
