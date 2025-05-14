import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      

export const addGroup = createAsyncThunk(
    'groups/addGroup',
    async (group, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5248/api/Group/Add', group);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add group');
        }
    }                                                                                                                                                                                                           
);
