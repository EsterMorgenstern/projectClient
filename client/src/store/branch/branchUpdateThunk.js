import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateBranch = createAsyncThunk(
    'branches/updateBranch',
    async (branchData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Branch/Update`, branchData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update branch');
        }
    }
);
