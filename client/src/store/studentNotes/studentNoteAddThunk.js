import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addStudentNote = createAsyncThunk(
    'studentNotes/add',
    async (noteData, { rejectWithValue }) => {
        try {
            console.log('🚀 Sending to server:', noteData);
            console.log('🚀 API URL:', `${API_BASE_URL}/StudentNotes/Add`);
            
            const response = await axios.post(
                `${API_BASE_URL}/StudentNotes/Add`,
                noteData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('✅ Server response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Server error:', error.response?.data);
            console.error('❌ Status:', error.response?.status);
            console.error('❌ Headers:', error.response?.headers);
            
            // הדפסת פרטי validation errors אם יש
            if (error.response?.data?.errors) {
                console.error('❌ Validation errors details:');
                Object.keys(error.response.data.errors).forEach(field => {
                    console.error(`   - ${field}: ${error.response.data.errors[field]}`);
                });
            }
            
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
