import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to add a Instructor
export const addInstructor = createAsyncThunk(
    'instructors/addInstructor',
    async (instructorData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5248/api/Instructor/Add', instructorData);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add student');
        }
    }
);