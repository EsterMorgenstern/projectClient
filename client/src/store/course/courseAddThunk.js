import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      
import API_BASE_URL from '../../config/api';

export const addCourse = createAsyncThunk(
    'courses/addCourse',
    async (course, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Course/Add`, course);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add course');
        }
    }                                                                                                                                                                                                           
);
