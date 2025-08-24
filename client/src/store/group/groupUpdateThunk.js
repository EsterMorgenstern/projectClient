import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateGroup = createAsyncThunk(
    'groups/updateGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Group/Update`, groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update group');
        }
    }
);
