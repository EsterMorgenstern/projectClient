import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      
import API_BASE_URL from '../../config/api';

export const addBranch = createAsyncThunk(
    'branches/addBranch',
    async (branch, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Branch/Add`, branch);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add branch');
        }
    }                                                                                                                                                                                                           
);
