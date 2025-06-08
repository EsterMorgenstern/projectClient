import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:5248/api/Student/Delete/${studentId}`);
            
            return { id: studentId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);
