import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteBranch = createAsyncThunk(
    'branches/deleteBranch',
    async (branchId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Branch/Delete?branchId=${branchId}`);
            return { branchId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete branch');
        }
    }
);
