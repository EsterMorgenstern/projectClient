import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      

export const addBranch = createAsyncThunk(
    'branches/addBranch',
    async (branch, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5248/api/Branch/Add`, branch);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add branch');
        }
    }                                                                                                                                                                                                           
);
