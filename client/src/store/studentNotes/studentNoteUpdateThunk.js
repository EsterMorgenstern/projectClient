import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateStudentNote = createAsyncThunk(
    'studentNotes/updateStudentNote',
    async (studentNote, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5248/api/StudentNotes/Update`, studentNote);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit instructor');
        }
    }
);
