import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5248/api/Student/Delete/${studentId}`);


            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);