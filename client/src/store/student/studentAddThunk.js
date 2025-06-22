import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

// Thunk to add a student
export const addStudent = createAsyncThunk(
    'students/addStudent',
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Student/Add`, studentData);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add student');
        }
    }
);