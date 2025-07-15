import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchPaymentHistory = createAsyncThunk(
    'payments/fetchPaymentHistory',
    async (studentId, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching payment history for student:', studentId);
            const response = await axios.get(`${API_BASE_URL}/Payments/GetByStudentId/${studentId}`);
            console.log('✅ Payment history fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching payment history:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
