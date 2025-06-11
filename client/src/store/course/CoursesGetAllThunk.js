import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching courses from API...');
            const response = await axios.get('http://localhost:5248/api/Course/GetAll');
            console.log('Courses response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch courses');
        }
    }
);
