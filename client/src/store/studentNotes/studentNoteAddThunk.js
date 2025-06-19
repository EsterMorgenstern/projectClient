import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const addStudentNote = createAsyncThunk(
    'studentNotes/add',
    async (noteData, { rejectWithValue }) => {
        try {
            console.log('🚀 Sending to server:', noteData);
            console.log('🚀 API URL:', 'http://localhost:5248/api/StudentNotes/Add');
            
            const response = await axios.post(
                'http://localhost:5248/api/StudentNotes/Add',
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
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
