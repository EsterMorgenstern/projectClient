import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      
import API_BASE_URL from '../../config/api';

export const addGroup = createAsyncThunk(
    'groups/addGroup',
    async (group, { rejectWithValue }) => {
        try {
            

            const response = await axios.post(`${API_BASE_URL}/Group/Add`, group);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add group');
        }
    }                                                                                                                                                                                                           
);
