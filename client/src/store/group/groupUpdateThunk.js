import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updateGroup = createAsyncThunk(
    'groups/updateGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            console.log('📤 updateGroup thunk - sending:', groupData);
            const response = await axios.put(`${API_BASE_URL}/Group/Update`, groupData);
            console.log('✅ updateGroup response:', response.data);
            return response.data;
        } catch (error) {
            const payload = error.response?.data;
            console.error('❌ updateGroup error:', payload || error.message);
            if (payload?.errors) {
                Object.entries(payload.errors).forEach(([field, msgs]) => {
                    console.error(`❌ ${field}:`, msgs);
                });
            }
            return rejectWithValue(payload || 'Failed to update group');
        }
    }
);
