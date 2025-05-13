import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the thunk
export const fetchStudents = createAsyncThunk(
    'students/fetchStudents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://localhost:5248/api/Student/GetAll');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);