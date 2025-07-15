import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchPaymentMethods = createAsyncThunk(
    'payments/fetchPaymentMethods',
    async (studentId, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching payment methods for student:', studentId);
            const response = await axios.get(`${API_BASE_URL}/PaymentMethods/GetByStudentId/${studentId}`);
            console.log('✅ Payment methods fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching payment methods:', error);
            return rejectWithValue(error.response?.data || 'שגיאה בטעינת אמצעי התשלום');
        }
    }
);
