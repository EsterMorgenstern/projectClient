import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteStudentNote = createAsyncThunk(
    'studentNotes/deleteStudentNote',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:5248/api/StudentNotes/Delete?noteId=${noteId}`);
        
            return { id: noteId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);
