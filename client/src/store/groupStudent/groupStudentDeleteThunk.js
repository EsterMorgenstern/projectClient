import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
export const deleteGroupStudent = createAsyncThunk(
    'groupStudent/deleteGroupStudent',
    async (gsId, { rejectWithValue }) => {
        try {
            const response = axios.delete(`${API_BASE_URL}/GoupStudent/Delete?gsId=${gsId}`, {
              
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete course');
        }
    }
);
