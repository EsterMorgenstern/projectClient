import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteBranch = createAsyncThunk(
    'courses/deleteBranch',
    async (branchId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Branch/Delete?branchId=${branchId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
