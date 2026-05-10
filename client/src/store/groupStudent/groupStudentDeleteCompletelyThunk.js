import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteGroupStudentCompletely = createAsyncThunk(
    'groupStudent/deleteGroupStudentCompletely',
    async (gsId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/GroupStudent/DeleteCompletely?gsId=${gsId}`);
            return { gsId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to completely delete group student');
        }
    }
);
