import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteStudentNote = createAsyncThunk(
    'studentNotes/deleteStudentNote',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/StudentNotes/Delete?noteId=${noteId}`);
        
            return { id: noteId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);
