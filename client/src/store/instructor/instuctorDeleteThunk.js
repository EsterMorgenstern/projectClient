import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteInstructor = createAsyncThunk(
    'instructors/deleteInstructor',
    async (id, { rejectWithValue }) => {
        try {

            const response = await axios.delete(`${API_BASE_URL}/Instructor/Delete/${id}`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete instructor');
        }
    }
);
