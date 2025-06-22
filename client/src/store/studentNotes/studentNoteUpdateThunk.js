import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateStudentNote = createAsyncThunk(
    'studentNotes/updateStudentNote',
    async (studentNote, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/StudentNotes/Update`, studentNote);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
