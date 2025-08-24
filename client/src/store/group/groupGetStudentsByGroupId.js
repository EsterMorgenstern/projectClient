import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getStudentsByGroupId = createAsyncThunk(
    'groups/getStudentsByGroupId',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Group/GetStudentsByGroupId/${groupId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get students by group');
        }
    }
);
