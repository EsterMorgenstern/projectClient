import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Student/Delete/${studentId}`);
            
            return { id: studentId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);
