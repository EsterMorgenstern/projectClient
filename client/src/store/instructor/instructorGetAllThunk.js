import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the thunk
export const fetchInstructors = createAsyncThunk(
    'students/fetchInstructors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://localhost:5000/api/Instructor/GetAll');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);