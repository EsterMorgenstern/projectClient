import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to add a student
export const addStudent = createAsyncThunk(
    'students/addStudent',
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://localhost:5248/api/Student/Addstudent', studentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add student');
        }
    }
);