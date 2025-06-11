import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      

export const addStudentNote = createAsyncThunk(
    'studentNote/addStudentNote',
    async (studentNote, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5248/api/StudentNotes/Add`, studentNote);


            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add course');
        }
    }                                                                                                                                                                                                           
);
