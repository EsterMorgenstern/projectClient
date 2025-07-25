import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const editStudent = createAsyncThunk(
    'students/editStudent',
    async (student, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Student/Update`, student);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
