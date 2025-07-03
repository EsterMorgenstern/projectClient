import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteGroup = createAsyncThunk(
    'groups/deleteCourse',
    async (group, { rejectWithValue }) => {
        try {
            const response = axios.delete(`${API_BASE_URL}/Group/Delete`, {
                data: group
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
