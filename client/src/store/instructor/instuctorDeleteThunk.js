import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const deleteInstructor = createAsyncThunk(
    'instructors/deleteInstructor',
    async (id, { rejectWithValue }) => {
        try {

            const response = await axios.delete(`https://localhost:5248/api/Instructor/Delete/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete instructor');
        }
    }
);
