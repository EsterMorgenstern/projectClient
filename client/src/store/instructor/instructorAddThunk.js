import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

// Thunk to add a Instructor
export const addInstructor = createAsyncThunk(
    'instructors/addInstructor',
    async (instructorData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Instructor/Add`, instructorData);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add student');
        }
    }
);