import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteGroupStudent = createAsyncThunk(
    'groupStudent/deleteGroupStudent',
    async (gsId, { rejectWithValue }) => {
        try {
            console.log('🗑️ Deleting group student with ID:', gsId);
            
            const response = await axios.delete(`${API_BASE_URL}/GroupStudent/Delete?gsId=${gsId}`);
            
            console.log('✅ Group student deleted successfully:', response.data);
            
            return { gsId, data: response.data };
        } catch (error) {
            console.error('❌ Error deleting group student:', error);
            return rejectWithValue(error.response?.data || 'Failed to delete group student');
        }
    }
);
