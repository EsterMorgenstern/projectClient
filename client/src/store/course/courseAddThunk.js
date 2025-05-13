import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      

export const addCourse = createAsyncThunk(
    'courses/addCourse',
    async (course, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://localhost:5248/api/Course/Add', course);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add course');
        }
    }                                                                                                                                                                                                           
);
